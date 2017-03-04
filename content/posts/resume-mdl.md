+++
date = "2016-12-09T21:11:42Z"
title = "Resume MDL - Hugo Theme"
tags = [
  "resume-mdl",
  "new",
]
title_color = "mdl-color-text--accent-contrast"
draft = true
+++

### Images
Resume-mdl provides some built-in styling for featured images as well as for images included in the body of a post.

#### Featured Images
A featured image can be specified in the front matter of a post by setting a value for `featured_img.url`. If not value is set, the featured image area will default to the 

### Syntax Highlighting
Syntax highlight is done with [Pygments](http://pygments.org/). Installation instructions can be found [here](https://gohugo.io/extras/highlighting/#pygments) in the Hugo documentation.

To generate highlighted code, you can either use the built in Hugo `highlight` shortcode or you can use Github style backticks. Pygments either generates inline css styles or adds classes to your markup when it outputs html. Resume-mdl uses the classes approach, which requires a stylesheet. Resume-mdl uses the , which you can get on [github](https://github.com/richleland/pygments-css) or in Python wherever Pygments is installed as follows:

#### List available styles
``` python
from pygments.styles import get_all_styles
styles = list(get_all_styles())
for s in sorted(styles):
    print(s)
```
That should generate a list of styles, that looks something like:
"linenos=inline, classprefix=resume-mdl--highlight"
```
algol
algol_nu
autumn
borland
bw
colorful
default
emacs
friendly
fruity
igor
lovelace
manni
monokai
murphy
native
paraiso-dark
paraiso-light
pastie
perldoc
rrt
tango
trac
vim
vs
xcode
```

If you want to see what the styles look like, you can go to the Pygments [demo page](http://pygments.org/demo/), paste some code in and then change the style with drop down menu.

You can use the inline styles approach by changing `pygmentsuseclasses` in `config.toml` to `false`.
