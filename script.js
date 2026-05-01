/**
 * SMART BUDGET PLANNER — script.js
 * 0/1 Knapsack Dynamic Programming Implementation
 * With DP table visualization and step-by-step explanation
 */

'use strict';

/* =============================================
   STATE
   ============================================= */
let items = [];           // { id, name, cost, value }
let nextId = 1;

/* =============================================
   DOM REFERENCES
   ============================================= */
const budgetInput       = document.getElementById('budget-input');
const itemNameInput     = document.getElementById('item-name');
const itemCostInput     = document.getElementById('item-cost');
const itemValueInput    = document.getElementById('item-value');
const addItemBtn        = document.getElementById('add-item-btn');
const formError         = document.getElementById('form-error');
const itemsTbody        = document.getElementById('items-tbody');
const itemCountBadge    = document.getElementById('item-count');
const emptyState        = document.getElementById('empty-state');
const itemsTableWrap    = document.getElementById('items-table-wrap');
const optimizeBtn       = document.getElementById('optimize-btn');
const resetBtn          = document.getElementById('reset-btn');
const resetBtnResults   = document.getElementById('reset-btn-results');
const fabResetBtn       = document.getElementById('fab-reset-btn');
const loadingOverlay    = document.getElementById('loading-overlay');
const resultsCard       = document.getElementById('results-card');
const dpTableCard       = document.getElementById('dp-table-card');
const stepsCard         = document.getElementById('steps-card');
const resultValue       = document.getElementById('result-value');
const resultCost        = document.getElementById('result-cost');
const resultBudgetLeft  = document.getElementById('result-budget-left');
const selectedItemsList = document.getElementById('selected-items-list');
const comparisonTbody   = document.getElementById('comparison-tbody');
const dpTableEl         = document.getElementById('dp-table');
const stepsList         = document.getElementById('steps-list');
const toggleDpBtn       = document.getElementById('toggle-dp-btn');
const dpTableOuter      = document.getElementById('dp-table-outer');
const toggleStepsBtn    = document.getElementById('toggle-steps-btn');

/* =============================================
   UTILITY
   ============================================= */
function showError(msg) {
  formError.textContent = msg;
  formError.style.opacity = '1';
  setTimeout(() => { formError.style.opacity = '0'; }, 3500);
}
function clearError() { formError.textContent = ''; }

function setHidden(el, hide) {
  if (hide) el.classList.add('hidden');
  else       el.classList.remove('hidden');
}

function formatCurrency(n) { return '₹' + n.toLocaleString('en-IN'); }

/* =============================================
   ITEM MANAGEMENT
   ============================================= */
function addItem() {
  clearError();
  const name  = itemNameInput.value.trim();
  const cost  = parseInt(itemCostInput.value, 10);
  const value = parseInt(itemValueInput.value, 10);

  if (!name)           return showError('⚠ Please enter an item name.');
  if (!cost || cost <= 0)  return showError('⚠ Cost must be a positive number.');
  if (!value || value <= 0) return showError('⚠ Value must be a positive number.');
  if (items.some(i => i.name.toLowerCase() === name.toLowerCase()))
    return showError('⚠ An item with this name already exists.');

  const item = { id: nextId++, name, cost, value };
  items.push(item);
  renderItems();

  // Clear form
  itemNameInput.value  = '';
  itemCostInput.value  = '';
  itemValueInput.value = '';
  itemNameInput.focus();
}

function deleteItem(id) {
  items = items.filter(i => i.id !== id);
  renderItems();
}

function renderItems() {
  itemCountBadge.textContent = items.length + (items.length === 1 ? ' item' : ' items');

  if (items.length === 0) {
    setHidden(emptyState, false);
    setHidden(itemsTableWrap, true);
    return;
  }
  setHidden(emptyState, true);
  setHidden(itemsTableWrap, false);

  itemsTbody.innerHTML = '';
  items.forEach((item, idx) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td class="item-num-cell">${idx + 1}</td>
      <td class="item-name-cell">${escapeHtml(item.name)}</td>
      <td class="item-cost-cell">${formatCurrency(item.cost)}</td>
      <td class="item-value-cell">${item.value}</td>
      <td>
        <button class="btn-danger-xs" data-id="${item.id}" aria-label="Delete ${escapeHtml(item.name)}">✕ Del</button>
      </td>`;
    itemsTbody.appendChild(tr);
  });

  // Bind delete buttons
  itemsTbody.querySelectorAll('.btn-danger-xs').forEach(btn => {
    btn.addEventListener('click', () => deleteItem(parseInt(btn.dataset.id, 10)));
  });
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* =============================================
   RESET
   ============================================= */
function resetAll() {
  items = [];
  nextId = 1;
  budgetInput.value = '';
  itemNameInput.value = '';
  itemCostInput.value = '';
  itemValueInput.value = '';
  clearError();
  renderItems();
  setHidden(resultsCard, true);
  setHidden(dpTableCard, true);
  setHidden(stepsCard, true);
  // Scroll back to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =============================================
   0/1 KNAPSACK — DYNAMIC PROGRAMMING
   ============================================= */

/**
 * Solves the 0/1 Knapsack problem using bottom-up DP.
 *
 * @param {number} budget - Total capacity (budget)
 * @param {Array}  items  - Array of {name, cost, value}
 * @returns {{ dp, selected, totalCost, totalValue, steps }}
 */
function knapsack(budget, items) {
  const n  = items.length;
  const W  = budget;
  const steps = [];

  // Build (n+1) x (W+1) DP table filled with 0
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  steps.push({
    text: `Initialized a DP table of size <strong>(${n+1}) × (${W+1})</strong>. Rows = items (0…${n}), Columns = budget 0…${W}.`
  });

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 0; w <= W; w++) {
      // Option A: skip item i
      dp[i][w] = dp[i - 1][w];

      // Option B: take item i (if it fits)
      if (item.cost <= w) {
        const withItem = dp[i - 1][w - item.cost] + item.value;
        if (withItem > dp[i][w]) {
          dp[i][w] = withItem;
        }
      }
    }

    // Record step for this item
    if (item.cost <= W) {
      steps.push({
        text: `Item <strong>"${escapeHtml(item.name)}"</strong> (cost=${item.cost}, value=${item.value}): evaluated for all budgets 0–${W}.`
      });
    } else {
      steps.push({
        text: `Item <strong>"${escapeHtml(item.name)}"</strong> (cost=${item.cost}, value=${item.value}): <span class="step-skip">skipped — cost exceeds budget.</span>`
      });
    }
  }

  // Backtrack to find selected items
  let w = W;
  const selected = [];
  for (let i = n; i >= 1; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(items[i - 1]);
      steps.push({
        text: `<span class="step-selected">✔ Selected <strong>"${escapeHtml(items[i-1].name)}"</strong></span> (dp[${i}][${w}]=${dp[i][w]} ≠ dp[${i-1}][${w}]=${dp[i-1][w]}).`
      });
      w -= items[i - 1].cost;
    } else {
      steps.push({
        text: `<span class="step-skip">✗ Skipped <strong>"${escapeHtml(items[i-1].name)}"</strong></span> (dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}).`
      });
    }
  }

  const totalValue = selected.reduce((s, it) => s + it.value, 0);
  const totalCost  = selected.reduce((s, it) => s + it.cost, 0);

  steps.push({
    text: `Optimization complete. <strong>Max value = ${totalValue}</strong>, Total cost = ${formatCurrency(totalCost)}.`
  });

  return { dp, selected, totalCost, totalValue, steps };
}

/* =============================================
   RENDER RESULTS
   ============================================= */
function renderResults(budget, result) {
  const { dp, selected, totalCost, totalValue, steps } = result;
  const selectedNames = new Set(selected.map(i => i.name));

  // Stats
  resultValue.textContent      = totalValue;
  resultCost.textContent       = formatCurrency(totalCost);
  resultBudgetLeft.textContent = formatCurrency(budget - totalCost);

  // Selected chips
  selectedItemsList.innerHTML = '';
  if (selected.length === 0) {
    selectedItemsList.innerHTML = '<span style="color:var(--text-muted);font-size:0.85rem">No items fit within the budget.</span>';
  } else {
    const emojis = ['📱','⌚','💻','🎧','📷','🎮','📚','🖥️','🔌','🎒','👟','💎'];
    selected.forEach((item, idx) => {
      const chip = document.createElement('span');
      chip.className = 'selected-chip';
      chip.style.animationDelay = (idx * 0.07) + 's';
      chip.innerHTML = `<span class="chip-icon">${emojis[idx % emojis.length]}</span>${escapeHtml(item.name)}`;
      selectedItemsList.appendChild(chip);
    });
  }

  // Comparison table
  comparisonTbody.innerHTML = '';
  items.forEach(item => {
    const isSelected = selectedNames.has(item.name);
    const tr = document.createElement('tr');
    tr.className = isSelected ? 'row-selected' : 'row-rejected';
    tr.innerHTML = `
      <td style="font-weight:600;color:${isSelected ? 'var(--success)' : 'var(--text-secondary)'}">${escapeHtml(item.name)}</td>
      <td style="font-family:var(--font-mono)">${formatCurrency(item.cost)}</td>
      <td style="font-family:var(--font-mono)">${item.value}</td>
      <td><span class="status-pill ${isSelected ? 'pill-selected' : 'pill-rejected'}">${isSelected ? '✔ Selected' : '✗ Skipped'}</span></td>`;
    comparisonTbody.appendChild(tr);
  });

  setHidden(resultsCard, false);
}

function renderDPTable(budget, result) {
  const { dp } = result;
  const n = items.length;
  const W = budget;

  dpTableEl.innerHTML = '';

  // Header row: budget 0..W
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const cornerTh = document.createElement('th');
  cornerTh.textContent = 'Item \\ Budget';
  cornerTh.style.minWidth = '110px';
  headerRow.appendChild(cornerTh);
  for (let w = 0; w <= W; w++) {
    const th = document.createElement('th');
    th.textContent = w;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  dpTableEl.appendChild(thead);

  // Determine highlighted cells (optimal path)
  const highlightSet = new Set();
  let ww = W;
  for (let i = n; i >= 1; i--) {
    highlightSet.add(`${i},${ww}`);
    if (dp[i][ww] !== dp[i-1][ww]) ww -= items[i-1].cost;
  }

  // Body rows
  const tbody = document.createElement('tbody');
  for (let i = 0; i <= n; i++) {
    const tr = document.createElement('tr');
    const rowTh = document.createElement('th');
    rowTh.textContent = i === 0 ? '— (none)' : items[i-1].name;
    rowTh.style.textAlign = 'left';
    tr.appendChild(rowTh);
    for (let w = 0; w <= W; w++) {
      const td = document.createElement('td');
      td.textContent = dp[i][w];
      if (dp[i][w] > 0 && highlightSet.has(`${i},${w}`)) {
        td.className = 'dp-cell-selected';
      } else if (dp[i][w] > 0 && i > 0 && dp[i][w] > dp[i-1][w]) {
        td.className = 'dp-cell-highlight';
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  dpTableEl.appendChild(tbody);

  setHidden(dpTableCard, false);
}

function renderSteps(result) {
  stepsList.innerHTML = '';
  result.steps.forEach((step, idx) => {
    const li = document.createElement('li');
    li.className = 'step-item';
    li.style.animationDelay = (idx * 0.04) + 's';
    li.innerHTML = step.text;
    stepsList.appendChild(li);
  });
  setHidden(stepsCard, false);
}

/* =============================================
   OPTIMIZE HANDLER
   ============================================= */
function optimize() {
  clearError();

  const budget = parseInt(budgetInput.value, 10);
  if (!budget || budget <= 0) {
    budgetInput.focus();
    return showError('⚠ Please enter a valid budget greater than 0.');
  }
  if (items.length === 0) {
    return showError('⚠ Please add at least one item before optimizing.');
  }
  if (budget > 100000) {
    return showError('⚠ Budget is too large for table visualization (max 100,000). Please use a smaller value.');
  }

  // Show loading
  setHidden(loadingOverlay, false);
  setHidden(resultsCard, true);
  setHidden(dpTableCard, true);
  setHidden(stepsCard, true);

  // Defer computation to allow UI to paint the loader
  setTimeout(() => {
    try {
      const result = knapsack(budget, items);
      renderResults(budget, result);
      renderDPTable(budget, result);
      renderSteps(result);
    } catch (e) {
      console.error(e);
      showError('An unexpected error occurred. Try reducing the budget or number of items.');
    } finally {
      setHidden(loadingOverlay, true);
      // Scroll to results on mobile
      if (window.innerWidth <= 900) {
        resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, 600);
}

/* =============================================
   TOGGLE DP TABLE & STEPS
   ============================================= */
toggleDpBtn.addEventListener('click', () => {
  const isHidden = dpTableOuter.classList.toggle('hidden');
  toggleDpBtn.textContent = isHidden ? 'Show' : 'Hide';
  toggleDpBtn.setAttribute('aria-expanded', String(!isHidden));
});

toggleStepsBtn.addEventListener('click', () => {
  const isHidden = stepsList.classList.toggle('hidden');
  toggleStepsBtn.textContent = isHidden ? 'Show' : 'Hide';
  toggleStepsBtn.setAttribute('aria-expanded', String(!isHidden));
});

/* =============================================
   KEYBOARD SUPPORT
   ============================================= */
[itemNameInput, itemCostInput, itemValueInput].forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') addItem();
  });
});
budgetInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') optimize();
});

/* =============================================
   EVENT LISTENERS
   ============================================= */
addItemBtn.addEventListener('click', addItem);
optimizeBtn.addEventListener('click', optimize);
resetBtn.addEventListener('click', resetAll);
resetBtnResults.addEventListener('click', resetAll);
fabResetBtn.addEventListener('click', resetAll);

/* =============================================
   DEMO DATA (preloaded on page load)
   ============================================= */
function loadDemoData() {
  const demo = [
    { name: 'Phone',   cost: 200, value: 90 },
    { name: 'Laptop',  cost: 500, value: 160 },
    { name: 'Watch',   cost: 150, value: 70 },
    { name: 'Headphones', cost: 100, value: 50 },
    { name: 'Camera',  cost: 300, value: 120 },
  ];
  demo.forEach(d => {
    items.push({ id: nextId++, ...d });
  });
  budgetInput.value = '600';
  renderItems();
}

/* =============================================
   INIT
   ============================================= */
loadDemoData();
