# OPAL-AlgoService

[![Build Status](https://travis-ci.org/OPAL-Project/OPAL-AlgoService.svg?branch=master)](https://travis-ci.org/OPAL-Project/OPAL-AlgoService)

OPAL-AlgoService is designed to save python code for algorithms for usage in OPAL-Compute. We provide functionalities such as 

- Adding an algorithm
- Update an algorithm
- Versioning of algorithm
- Deleting an algorithm

Each algorithm is associated with an unique `algoName`, `description` and `algorithm` object. `algorithm` object contains the code to be used and `className` of the class inside the code. This code is then imported into the main file for execution in compute.

Each algorithm defined in the `code` is a class inherited from `opalalgorithm.core.base` from [opalalgorithms](https://github.com/shubhamjain0594/opalalgorithms) library
