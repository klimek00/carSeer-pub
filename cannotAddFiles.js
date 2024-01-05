const $ = document.querySelector.bind(document);
const signs = { 1: '+', 2: '-', 3: '*', 4: '/' };

for (const [key, val] of Object.entries(signs)) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (j === 0 && val === '/') {
        continue;
      }
      
      const result = eval(`${i} ${val} ${j}`);
      const formattedResult = val === '/' ? result.toFixed(10) : result;

      $('.xd').innerHTML += `<pre>if(num1 == ${i} && sign == "${val}" && num2 == ${j})<br>&emsp;&emsp;print("${i}${val}${j} = ${formattedResult}")</pre>`;
    }
  }
}
