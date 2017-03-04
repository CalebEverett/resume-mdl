+++
date = "2016-12-16T23:29:29Z"
title = "zero to machine learning with j"
draft = true

tags = [
  "machine-learning",
  "jlang",
]
title_color = "mdl-color-text--accent-contrast"

[featured_img]
  url = ""
  pos = ""
  repeat = ""
  size_summary = ""
  size_single = ""

+++

{{< highlight j "linenos=table" >}}
X =: (<(i.#data); <i.(_1{$data)-1) { data
y =: (<(i.#data);(_1{$data)-1){data
{{< /highlight >}}
