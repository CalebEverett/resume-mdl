+++
date             = "2016-12-08"
tags             = ["nodejs", "encryption", "AWS"]
title            = "Envelope Encryption with AWS Key Management"
title_color      = "black"
[featured_img]
url = "/images/envelope.png"
pos = "center"
repeat = ""
size_single = "auto 70%"
size_summary = "90%"
+++

[Envelope encryption](http://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/introduction.html#envelope) is a multi-step process that utilizes two encryption keys, a master key and a data key. The master key is used with a unique identifier to obtain the data key. The data key is used to encrypt the data and then itself is encrypted using the master key and then stored along side the encrypted data and unique identifier. To decrypt encrypted data, the encrypted data key is decrypted using the master key and unique identifier and then used to decrypt the encrypted data.

A nice feature of using the [AWS Key Management Service](http://docs.aws.amazon.com/kms/latest/developerguide/overview.html) (KMS) is that the master key never leaves AWS. It is accessed via api according to configured permissions. KMS operates as a simple endpoint that either delivers a new data key or decrypts an encrypted one as long as the correct unique identifier is provided.

### Module
This module was developed as part of an application to provide secure online access to student records. It is used to encrypt files before storing them in a database and to decrypt them before they are downloaded by authorized users.

- Written with Promises and ES6 syntax, the code is straightforward and easy to understand.
- Uses the [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) algorithm, which is state of the art in terms of security and performance.
- The encrypted data key, unique identifier and initialization vector required by the AES-256-GCM algorithm are combined with the encrypted data into a single buffer, providing an extra element of security and convenience.

{{< highlight JavaScript "linenos=table" >}}
var Promise = require("bluebird")
var crypto = require('crypto')
var AWS = require('aws-sdk')
AWS.config.region = 'us-west-1'
var kms = new AWS.KMS({
  apiVersion: '2014-11-01',
  accessKeyId: process.env.KMS_KEY_ID,
  secretAccessKey: process.env.KMS_KEY_SECRET
})


const getEncryptKey = (id) => {
  return new Promise(function(resolve, reject) {
    var params = {
      KeyId: process.env.KEY,
      EncryptionContext: {
        id: id,
      },
      KeySpec: 'AES_256'
    }
    kms.generateDataKey(params, function(err, data) {
      if(err) {
        console.log(err)
        return reject(new Error("Couldn't get key"))
      } else {
        return resolve(data)
      }
    })
  })
}

const getIv = () => {
  return new Promise((resolve, reject) => {
    var iv = crypto.randomBytes(12)
    if (!iv) reject(new Error("iv failed"))
    resolve(iv)
  })
}

const encryptFile = (datakey, iv, id, file) => {
  return new Promise((resolve, reject) => {
      if (!file) {
          return reject(new Error("Encryption failed: no file to encrypt"))
      }
    //encrypt file
    var plainfile = Buffer.from(file, 'base64')
    var cipher = crypto.createCipheriv('aes-256-gcm', datakey.Plaintext, iv)
    cipher.setAAD(Buffer.from(id))
    var encrypted = Buffer.concat([cipher.update(plainfile), cipher.final()])
    var tag = cipher.getAuthTag()
    var cipherkey = datakey.CiphertextBlob

    //create combined buffer
    var startPoint = 6
    var fileObj = { tag, iv, cipherkey, encrypted }
    var combined = Buffer.alloc(Object.keys(fileObj).reduce((p, c) => p + fileObj[c].length, startPoint))
    Object.keys(fileObj).forEach((k, i) => {
      if (i < 3) combined.writeUInt16BE(fileObj[k].length, i * 2, true)
      fileObj[k].copy(combined, startPoint)
      startPoint += fileObj[k].length
    })
    if (!combined) {
      return reject(new Error("File encryption failed"))
    } else {
      return resolve(combined)
    }
  })
}

const getEncryptedFile = (id, plainfile) =>  {
  return new Promise((resolve, reject) => {
    Promise.join(getEncryptKey(id), getIv())
    .spread((datakey, iv) => encryptFile(datakey, iv, id, plainfile))
    .then((cipherfile) => resolve([id, cipherfile]))
    .catch((error) => reject(error))
  })
}

const createDecryptObject = (id, file) => {
  return new Promise((resolve, reject) => {
    var cipherfile = Buffer.from(file, 'base64')
    //parse buffer in order to create decipher object
    var fileKeys = ['tag', 'iv', 'cipherkey', 'encrypted', 'id']
    var fileObj = {}
    var startPoint = 6
    var endPoint = 6
    for (var i = 0; i < 4; i++) {
      endPoint = i < 3 ? startPoint + cipherfile.readUInt16BE(i*2) : cipherfile.length
      Object.assign(fileObj, {[fileKeys[i]]: cipherfile.slice(startPoint, endPoint)})
      startPoint = endPoint
    }
    fileObj.id = id
    if (!fileObj) {
      return reject(new Error("Decrypt object failed"))
    } else {
      resolve(fileObj)
    }
  })
}

const getDecryptKey = (fileObj) => {
  return new Promise((resolve, reject) => {
   var params = {
      CiphertextBlob: fileObj.cipherkey,
      EncryptionContext: {
        id: fileObj.id,
      }
    }

    kms.decrypt(params, function(err, datakey) {
      if (err) {
        return reject(new Error("Couldn't get key"))
        console.log(err)
      } else {
        resolve([fileObj, datakey])
      }
    })
  })
}

const decryptFile = (fileObj, datakey) => {
  return new Promise((resolve, reject) => {
    var decipher = crypto.createDecipheriv('aes-256-gcm', datakey.Plaintext, fileObj.iv)
    decipher.setAAD(Buffer.from(fileObj.id))
    decipher.setAuthTag(fileObj.tag)
    var decrypted = Buffer.concat([decipher.update(fileObj.encrypted), decipher.final()])
    decipher = null
    datakey = null
    if (!decrypted) {
      reject(new Error("Decryption failed"))
    } else {
      resolve(decrypted)
    }
  })
}

const getDecryptedFile = (id, cipherfile) => {
  return new Promise((resolve, reject) => {
    createDecryptObject(id, cipherfile)
    .then(getDecryptKey)
    .spread(decryptFile)
    .then(decrypted => resolve(decrypted))
    .catch((error) => console.log(error))
  })
}

module.exports = {
    getDecryptedFile: getDecryptedFile,
    getEncryptedFile: getEncryptedFile
}
{{< /highlight >}}

