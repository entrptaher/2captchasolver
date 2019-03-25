```
➜  node index.js
{ id: '61324982345' }
{ id: '61324982345', status: 'CAPCHA_NOT_READY' }
{ id: '61324982345', status: 'CAPCHA_NOT_READY' }
03A.............................xasdasddq12312313
```

```js
// get solution
const token = await solver();

// apply it
await page.evaluate((token)=>{
  document.getElementById("g-recaptcha-response").innerHTML = token;
  document.querySelector('#recaptcha input[type="submit"]').click();
}, token);
```
