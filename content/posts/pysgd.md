+++
date           = "2017-03-05T16:58:08Z"
title          = "pysgd"
tags           = ["python","machine-learning", "gradient-descent"]
title_color    = "mdl-color-text--accent-contrast"
mathjax        = "true"

[featured_img]
  pos          = "50% 70%"
  url          = "/images/python-descending.jpg"
  size_single  = ""
  size_summary = ""
  repeat       = ""

+++

The `pysgd` [package](https://github.com/CalebEverett/pysgd) is structured as a general gradient descent algorithm that accepts data, an objective function, a gradient descent adaptation and hyperparameters as its arguments. Below is the file structure of the package:

{{< highlight Bash >}}
pysgd
|   `-- __init__.py
|-- adaptations
|   |-- __init__.py
|   |-- adagrad.py
|   |-- adam.py
|   `-- constant.py
|-- objectives
|   |-- __init__.py
|   |-- linear.py
|   |-- logistic.py
|   `-- stab_tang.py
`-- tests
{{< /highlight >}}

The intention of this package is to present reasonbly efficient, working algorithms that are easy to understand.

The package is structured to make it easy to add additional objective functions and gradient descent adaptations, by following the basic form of the existing ones and adding them into their respective folders.

### Gradient Descent

Gradient descent is a method for minimizing an objective function. In machine learning applications the objective function to be minimized is the error, `J`, (or cost) of a predictive model. A predictive model consists of a parameters, $\theta$, that are applied to inputs, $X$, (also called training samples, features, observations or independent variables) in order to estimate an output, $\hat{y}$ (also called a label or dependent variable). Gradient descent attempts to determine the parameters that when applied to a set of inputs result in the lowest total error (the difference between the actual outcome and the one predicted by the model). Below is the basic predictive formula.

$$H(X,\theta)=\hat{y}$$

Below is an illustrative formula for determining the cost of a model.

$$J(\theta) = \sum_{i=1}^m\mid{h_i(\theta,x_i) - y_i}\mid$$

There are different formulas for computing cost depending on the application, but the formula above expresses the essence of predicting actual outcomes as closely as possible.

In order to minimze $J$ with respect to $\theta$, the algorithm starts with an abitrary value of $\theta$, determines the "direction" that would result in the fastest decrease in cost (called the gradient), updates $\theta$ in that direction by a small amount (called the learning rate or $\alpha$) and then repeats until cost $J$ has been minimized.


$$\theta_j := \theta_j - \alpha\triangledown\theta_jJ(\theta)$$

or

$$\theta_j := \theta_j - \alpha\frac\partial{\partial\theta_j}J(\theta)$$

### API

The package has one main function, `sgd`, that returns a $j$ x $(n + 2)$ array, where $j$ is the number of iterations and $n$ is the number of features in the data. $\theta_j$ is in the first $n + 1$ columns and the cost $J_j$ in the last column.

{{% bordered_table %}}
|Argument           |Definition                                                                                    |
|-------------------|----------------------------------------------------------------------------------------------|
|`theta0`           |Starting value of $\theta$ ($\theta_0$) in the form of an $1$ x$(n + 1)$ array.               |
|`obj='stab_tang'`  |Objective function to be minimized in the form of a string with a value of `stab_tang`, `linear` or `logistic`. `stab_tang` is for the [Stablinsky-Tang function](https://en.wikipedia.org/wiki/Test_functions_for_optimization), included for testing and illustrative purposes.  |
|`adapt='constant'` |Gradient descent adaptation in the form of a string with a value of `constant`, `adagrad` or `adam`.<ul><li> `constant` applies no adaptation</li><li>`adagrad` implements [Adaptive Gradient Algorithm](http://stanford.edu/~jduchi/projects/DuchiHaSi10_colt.pdf)</li><li>`adam` implements [Adaptive Moment Estimation](https://arxiv.org/pdf/1412.6980v8.pdf)</li></ul>                                                                 |
|`data=np.array([])`|Data in the form of an $m$ x $(n+1)$ array, including `ones` in the first column, if necessary, where $m$ is the number of training observations.                                                      |
|`size=50`          |Batch size in the form of an integer between $1$ and $m$. Batches are generated contiguously over the data. Data is shuffled between cycles.                                                                   |
|`alpha=.01`        |Learning rate $\alpha$ in the form of a floating point integer.                               |
|`epsilon=10**-8`   |Hyperparameter used by `adagrad` and `adam` for smoothing.                                    |
|`beta1=0.9`        |Hyperparamter used by `adam` that controls the decay rates of the moving gradient averages.   |
|`beta2=0.999`      |Hyperparamter used by `adam` that controls the decay rates of the moving gradient averages.   |
|`delta_min=10**-6` |Maximum change in $\theta_n$ to establish convergence in the form of a floating point integer.|
|`iters=1000`       |Maximum number of batches evaluated unless convergence is achieved in fewer iterations.       |
{{% /bordered_table %}}

#### Testing

Tests are in the `tests` folder using [pytest](http://doc.pytest.org/en/latest/index.html), with 100% coverage.

In addition to sample data sets, we also use the [Stablinsky-Tang function](https://en.wikipedia.org/wiki/Test_functions_for_optimization) for testing, which is non-convex, suitable for testing, with straightforward gradient computation. This allows us to compare the value of $\theta$ produced by each algorithm and its associated $J$ with values we can calculate directly. By using a known function with two dimensional inputs we can plot $J$ as a surface for a given range of $\theta$ values and then $J_\theta$ for each iteration of the algorithm to visualize the progression of the algorithms.

The Styblinski–Tang function with respect to $\theta$ is:

$$J(\theta) = \dfrac{\sum_{i=1}^n\theta_i^4-16\theta_i^2+5\theta_i}{n}$$

where $n$ is the number of dimensions in the data. For two dimensions, we can also express our cost function as:

$$J(\theta) = \dfrac{\theta_1^4-16\theta_1^2+5\theta_1+\theta_2^4-16\theta_2^2+5\theta_2}{2}$$

The global minimum of this function is $-78.33233$ at $\theta = (-2.903534, -2.903534)$

The Styblinski–Tang gradient function is:

$$\frac\partial{\partial\theta_n}J(\theta) = 2\theta_n^3-16\theta_n+2.5$$

The color scale of the surface plots in the [accompanying notebook](http://nbviewer.jupyter.org/github/CalebEverett/pysgd/blob/master/pysgd.ipynb) corresponds to the z-axis value, which represents cost $J$ for all values of $\theta$ in the displayed range. The color scale of the points on the surface, which represent the cost $J_{\theta_j}$ as a function of $\theta_j$ at each iteration of the model, corresponds to the iteration.

