# 🤖 Autonomous Robot Path Planner

An interactive browser-based simulation of autonomous robot navigation using the A* pathfinding algorithm.

## Overview

This project simulates a robot navigating through an environment containing obstacles.

The user can:

- Place obstacles
- Select a start position
- Select a goal position
- Generate random environments
- Run the A* pathfinding algorithm
- Visualize explored nodes
- Visualize the final path
- Watch the robot move along the calculated route

## Algorithm

The project uses the A* pathfinding algorithm.

A* determines the most promising path by combining:

- The cost already travelled
- A heuristic estimate of the remaining distance

For this grid-based simulation, Manhattan distance is used as the heuristic.

## Technologies

- HTML
- CSS
- JavaScript
- A* Pathfinding Algorithm

## Robotics Concept

The project represents a simplified autonomous navigation system.

In a physical robot, information from sensors or cameras could be used to construct a map of the environment. A path planning algorithm could then determine a safe route to the target.

## Features

- Interactive grid
- Obstacle mapping
- A* pathfinding
- Animated robot
- Random maze generation
- Path statistics
- Battery simulation

## Future Improvements

- Real robot integration
- Sensor-based obstacle detection
- Dijkstra vs A* comparison
- Dynamic obstacles
- ROS integration
- Reinforcement learning based navigation

## Demo

Live demo:

[Open the Robot Path Planner](YOUR_GITHUB_PAGES_LINK)
