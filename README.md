# Smart Budget Planner

A web-based budget optimization tool powered by the 0/1 Knapsack Dynamic Programming algorithm. This application helps users make optimal purchasing decisions by maximizing value within a given budget constraint.

## Features

- **Add Items**: Input items with their costs and importance values
- **Budget Setting**: Define your total available budget
- **Optimization**: Uses 0/1 Knapsack algorithm to find the best combination of items
- **Visualization**: Interactive DP table showing the optimization process
- **Step-by-Step Explanation**: Detailed breakdown of the algorithm's decision-making
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. Open `index.html` in your web browser
2. Set your total budget in the input field
3. Add items by entering their name, cost, and value/importance score
4. Click "Optimize Budget" to find the best combination
5. View the results, DP table, and step-by-step explanation

## Technologies Used

- HTML5
- CSS3 (with custom properties and animations)
- Vanilla JavaScript (ES6+)
- 0/1 Knapsack Dynamic Programming Algorithm

## Algorithm Overview

The 0/1 Knapsack problem is solved using dynamic programming where:
- Each item can be selected only once (0/1 constraint)
- The goal is to maximize total value without exceeding the budget
- DP table tracks optimal values for subproblems

## Browser Support

Works in all modern browsers that support ES6 features.

## License

This project is for educational purposes.