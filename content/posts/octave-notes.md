+++
title = "Octave Notes"
date = "2017-01-17T19:09:11Z"
tags = [
  "octave",
  "machine-learning",
]
title_color = "mdl-color-text--accent-contrast"

[featured_img]
url = "/images/octave-logo.svg"
pos = "center"
repeat = ""
size_single = "auto 90%"
size_summary = "90%"

+++


This a work in progress / running list of notes on recipes for working with [Octave](https://www.gnu.org/software/octave/).

[Octave Docs](https://www.gnu.org/software/octave/doc/v4.0.1/index.html#SEC_Contents)

#### Plotting Multiple Lines in a Loop

This was a compact way to create a quick graph of muliple lines of data with one call to `plot`. In this example, I loop through a range of learning rates in a gradient descent algorithm and then plot the change in cost against the number of iterations.

For each learning rate iteration, the series of cost changes is stored in a matrix. Then when all the iterations are complete, you just call `plot` on the entire matrix.

A nice trick on line 13 is using the same range of values that were looped through to create the series as the input for a legend. There may be an easier way to do this, but the legend function accepts a [cell array](https://www.gnu.org/software/octave/doc/v4.0.1/Cell-Arrays.html#Cell-Arrays) of strings as an argument, not an array of numbers. You can convert the numerical array to a cell array with [num2cell](https://www.gnu.org/software/octave/doc/interpreter/Creating-Cell-Arrays.html#XREFnum2cell) and then use [cellfun](https://www.gnu.org/software/octave/doc/v4.0.1/Function-Application.html#XREFcellfun) to convert the numbers to strings.

{{< highlight Octave "linenos=table" >}}
% Run Gradient Descent for range of alphas
alpha_range = [0.3, 0.1, 0.03, 0.01];
J_history_range = zeros(num_iters,length(alpha_range));
for a=1:length(alpha_range),
  [theta_r, J_history_range(:,a)] = gradientDescentMulti(X, y, theta, alpha_range(a), num_iters);
end
  
% Plot the convergence graph
figure;
plot(1:num_iters, J_history_range, 'LineWidth', 2);
xlabel('Number of iterations');
ylabel('Cost J');
legend(cellfun(@num2str, num2cell(alpha_range), "UniformOutput", false))

{{< /highlight >}}

{{< figure src="/images/alpha_plot.png" >}}
