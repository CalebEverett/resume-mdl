+++
date             = "2016-12-08T23:18:42Z"
tags             = ["resume-mdl", "new"]
title            = "Envelop Encryption with AWS Key Management"
title_color      = "mdl-color-text--accent-contrast"
draft            = true
[featured_img]
url              = "/images/lairdhamilton6.jpg"
pos              = "85% bottom"
size             = "cover"
repeat           = "no-repeat"

+++

### Envelope encryption

[Envelope encryption](http://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/introduction.html#envelope) is a multi-step process that utilizes two encryption keys, a master key and a data key. The master key is used with a unique identifier to obtain the data key. The data key is used to encrypt the data and then itself is encrypted using the master key and then stored along side the encrypted data and unique identifier. To decrypt encrypted data, the encrypted data key is decrypted using the master key and unique identifier and then used to decrypt the encrypted data.

A nice feature of using the [AWS Key Management Service](http://docs.aws.amazon.com/kms/latest/developerguide/overview.html) (KMS) is that the master key never leaves AWS. It is accessed via api according to configured permissions. KMS operates as a simple endpoint that either delivers a new data key or decrypts an encrypted one as long as the correct unique identifier is provided.

{{< figure src="/images/lairdhamilton6.jpg" caption="This is some awesome shnizzle!">}}

### Module
This module was developed as part of an application to provide secure online access to student records. It is used to encrypt files before storing them in a database and to decrypt them before they are downloaded by authorized users.

#### Highlights
- Written with Promises and ES6 syntax, the code is straightforward and easy to understand.
- Uses the [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) algorithm, which is state of the art in terms of security and performance.
- The encrypted data key, unique identifier and initialization vector required by the AES-256-GCM algorithm are combined with the encrypted data into a single buffer, providing an extra eleement of security and convenience.


#### Setup
An account at AWS is required. Here is more information on [KMS](https://aws.amazon.com/documentation/kms/) and the [KMS SDK](http://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/introduction.html). Below are the required modules.

{{< highlight JavaScript "linenos=table" >}}
var Promise = require("bluebird")
var fs = require('fs-extra')
var crypto = require('crypto')
var AWS = require('aws-sdk')
AWS.config.region = 'us-west-1'
var kms = new AWS.KMS({
  apiVersion: '2014-11-01',
  accessKeyId: process.env.KMS_KEY_ID,
  secretAccessKey: process.env.KMS_KEY_SECRET
})
{{< /highlight >}}

#### Encryption
The easiest way to understand the encryption flow is by examining the exported encryption function.
{{< highlight JavaScript "linenos=table" >}}
const getEncryptedFile = (id, plainfile) =>  {
  return new Promise((resolve, reject) => {
    Promise.join(getEncryptKey(id), getIv())
    .spread((datakey, iv) => encryptFile(datakey, iv, id, plainfile))
    .then((cipherfile) => resolve([id, cipherfile]))
    .catch((error) => reject(error))
  })
}
{{< /highlight >}}

A unique id and the data to be encrypted are passed into the `getEncryptedFile` function, which returns a Promise withat resolves with the encrypted file. The first step is to pass the id to `getEncryptKey(id)` and to get a datakey and to generate an initialization vector via the `getIv()`. Once the 
Using the [Node.js crypto module](https://nodejs.org/api/crypto.html) and the [AWS Encryption SDK](http://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/introduction.html) this module encrypts and decrypts individual electronic files using .  used the [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) encryption algorithm, which is start of the art in terms of security and performance.


Here are the key steps in the process, starting from a plaintext, unencrypted file and going full cycle to encrypt it store it in the database and then decrypt it and download it. I'll provide some more detail on how to set it up, but this assumes that the master key from the [AWS Key Management Service](http://docs.aws.amazon.com/kms/latest/developerguide/overview.html) has already been set up.

1. Read the plaintext file into the application
2. Get data key from AWS KMS by providing master key and identifier string (encryption context)
3. 

I also really like how the code turned out on this one. With the Promises and ES6 syntax, it makes it really easy to understand what is going on. The end result is just two exported function, one to encrypt a file and another to decrypt a file .



Same thing in the calls to the database, also written with Promises, the calls to encrypt and decrypt files, just show up as another small line in the chain of then statements.

{{< highlight JavaScript "linenos=table" >}}

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
{{< /highlight >}}
