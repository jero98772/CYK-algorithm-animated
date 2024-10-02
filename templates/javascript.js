function cykParse(grammar, inputString) {
            const n = inputString.length;
            const table = Array.from({ length: n }, () => Array.from({ length: n }, () => new Set()));

            // Fill the base case (terminals in the input string)
            for (let i = 0; i < n; i++) {
                for (const nonterminal in grammar) {
                    const productions = grammar[nonterminal];
                    for (const production of productions) {
                        // Check if the production contains a terminal symbol
                        if (production.includes(inputString[i])) {
                            table[i][i].add(nonterminal);
                        }
                    }
                }
            }

            // Fill the table for substrings of length 2 to n
            for (let length = 2; length <= n; length++) {
                for (let i = 0; i <= n - length; i++) {
                    let j = i + length - 1;
                    for (let k = i; k < j; k++) {
                        for (const nonterminal in grammar) {
                            const productions = grammar[nonterminal];
                            for (const production of productions) {
                                if (production.length === 2) {
                                    const B = production[0][0]; // First part of the production (nonterminal)
                                    const C = production[0][1]; // Second part of the production (nonterminal/terminal)
                                    if (table[i][k].has(B) && table[k + 1][j].has(C)) {
                                        table[i][j].add(nonterminal);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return table;
        }

        const T = cykParse(R, input);

        const buildTable = () => {
            const table = document.getElementById('cyk-table');
            table.innerHTML = '';
            let html = '';
            for (let i = 0; i < input.length; i++) {
                html += '<tr>';
                for (let j = 0; j < input.length; j++) {
                    html += `<td class="cell" id="cell-${i}-${j}"></td>`;
                }
                html += '</tr>';
            }
            table.innerHTML = html;
        };

        const fillTable = () => {
            const table = document.getElementById('cyk-table');
            let step = 0;
            const maxSteps = input.length * input.length;

            const interval = setInterval(() => {
                if (step >= maxSteps) {
                    clearInterval(interval);
                    return;
                }

                const row = Math.floor(step / input.length);
                const col = step % input.length;

                const cell = document.getElementById(`cell-${row}-${col}`);
                cell.textContent = Array.from(T[row][col]).join(', ');
                cell.classList.add('active');
                step++;
            }, 1000);
        };

        const startAnimation = () => {
            buildTable();
            fillTable();
        };