# MNIST Math

## Table of Contents
  * [Overview](#overview)
  * [Toolkit](#toolkit)
  * [Roadmap](#roadmap)

## Overview
![landingPage](https://user-images.githubusercontent.com/26447339/109899200-7d41c180-7c63-11eb-970c-61e02b04666c.PNG)

Mnist Math is an educational application that determines if user drawn digits satisfy randomly generated arithmetic equations. The model was trained upon the [MNIST dataset](http://yann.lecun.com/exdb/mnist/) (provided through the keras API) leveraging Tensorflow for training, saving and serving the model. The trained model was then translated to Tensorflow.js through with the [tfjs converter](https://github.com/tensorflow/tfjs/tree/master/tfjs-converter) for usage with the web application.

![demoPage](https://user-images.githubusercontent.com/26447339/109899082-466bab80-7c63-11eb-9ab4-8da7cc6b7c2d.PNG)

As the user answers questions correctly, their environment will continuously evolve around them. However, providing invalid answers will degenerate the garden! The model served in this distribution has a 97.7% prediction accuracy and the user drawn digits are processed identially to the methods utilized in generating the original [MNIST dataset](http://yann.lecun.com/exdb/mnist/).

## Toolkit
This project leverages the following frameworks/tools (Linked with their respective installation links)
  * [Tensorflow 1.14.0](https://www.tensorflow.org/install)
  * [Keras 2.3.1](https://pypi.org/project/Keras/)
  * [Matplotlib 3.1.1](https://matplotlib.org/stable/users/installing.html)
  * [Numpy 1.16.2](https://numpy.org/install/)
  * [Sklearn 0.20.3](https://scikit-learn.org/stable/install.html)
  * [Jupyter Notebook](https://jupyter.org/install)
  * [Opencv.js 4.5.1](https://docs.opencv.org/4.5.1/opencv.js) (Provided in the repo in Website/vendor/opencv.js)

The project requires your version of the frameworks/tools to be equal or greater than the values I utilized in this project.

## Roadmap
Though the model is fully implemented and allows users to train and deploy the network right out of the box, there are a few quality of life tools left to do in order to make user interaction much more simple
  * Localization - Directly translate a trained network into tf.js and inject it into the Website through the notebook so the client has less work to do
  * Website refinement - The website uses vanilla HTML,CSS,Javascript. It may be worth looking into leveraging an industrial framework to enhance the visual appeal
  * Enhance Complexity - Right now the website generates equations that sum to [0,9]. It may be best to enhance the experience by expanding the canvas to take in numerous digits thus allowing the website to generate much more complex equations.
  * Launch the website!
