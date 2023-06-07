# Rules Engine Programming Language

## Status

Proposed

## Context

In order to build the web app version of the Home Energy Analysis Tool, we will need to choose what frameworks and programming languages to use.

There is a similar wizard-style tool called the [Windfall app](https://windfall-develop.netlify.app/) that was previously built by Code for Boston.  This app uses a C++ WASM rules engine with a React/Typescript frontend ([repo](https://github.com/codeforboston/windfall-elimination)).  It can provide a good foundation for building this app.

## Decision

We will use Pyodide to create the rules engine.
We will use React and Typescript to create the frontend.

## Consequences
We will have a foundation to build the HEAT app from, accelerating development.

Although we are switching languages on the rules engine, using Python/Pyodide will allow us to leverage more complex data analysis libraries like Pandas out of the box, which will help with the complex rules in the current Excel tool.
