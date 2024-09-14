const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } = require('crypto');

const rootPath = path.join(__dirname, './html');


// 加密
function encrypt(data, password) {
  const salt = randomBytes(16);
  const iv = randomBytes(16);
  const key = pbkdf2Sync(password, salt, 10000, 32, 'sha512');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([salt, iv, encrypted, authTag]).toString('base64');
}

// 解密
function decrypt(combined, password) {
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 32);
  const encrypted = combined.slice(32, combined.length - 16);
  const authTag = combined.slice(combined.length - 16);
  const key = pbkdf2Sync(password, salt, 10000, 32, 'sha512');
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted) + decipher.final('utf8');
}

async function input() {
  process.stdin.setRawMode(true);
  process.stdout.write("Enter your password: ");
  let password = '';
  return new Promise(resolve => {
    process.stdin.on('data', (char) => {
      char = char + "";
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\u001B[2J\u001B[0;0f');
          resolve(password)
          break;
        default:
          process.stdout.write('*');
          if (char.charCodeAt(0) == 3) {
            process.exit(0)
          }
          password += char;
          break;
      }
    });
  })
}

// 定义一个函数，将 px 转换为 rem
function pxToRem(cssString, clientWidth = 375, designWidth = 750) {
  // width * 100 / designWidth
  const baseSize = clientWidth / (designWidth / 100);
  // 正则表达式匹配 CSS 中的 px 值，确保只替换样式中的 px
  const pxRegex = /([\d.]+)px/g;
  // 替换 px 为 rem，保持原来的数值比例
  return cssString.replace(pxRegex, (match, p1) => {
    const pxValue = parseFloat(p1);  // 获取 px 数值部分
    // 转换为 rem，保留四位小数,去掉后面的0
    const remValue = (pxValue / baseSize).toFixed(4).replace(/\.?0+$/, '');
    return `${remValue}rem`;
  });
}

const main = async function (
  enptyScriptFile = ['./js/index.js'], // 需要加密的js文件
  appDivName = 'app', // 需要加密的div
  outputFileName = 'app.html' // 输出文件名
) {
  let me = await input()
  // 服务器加密
  // const combined = await encrypt("12345678", me);
  // console.log("encrypted: ", combined);

  // 服务器加密,服务器解密
  // const decryptedData = await decrypt(Buffer.from(combined, 'base64'), me);
  // console.log("decryptedData", decryptedData);



  // 读取 index.html 文件
  const htmlFilePath = path.join(rootPath, 'index.html');
  let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

  // 将 CSS 中的 px 单位转换为 rem
  htmlContent = pxToRem(htmlContent);

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const appDiv = document.getElementById(appDivName);
  if (!appDiv) {
    console.error(`无法找到 div#${appDivName} 元素`);
    return;
  }

  let dynamicHTML = await encrypt(appDiv.innerHTML, me);
  appDiv.innerHTML = '';
  // const scriptElement = document.createElement('script');
  // scriptElement.textContent = ``
  // document.body.appendChild(scriptElement);
  const encrptyScript = document.getElementById('encrpty');
  encrptyScript.textContent += `var encrptyDiv = '${dynamicHTML}';`

  // 获取修改后的HTML内容
  const updatedHTML = dom.serialize();

  // 正则匹配 script 和 link 标签
  const scriptRegex = /<script\s+src=["'](.+?)["']\s*><\/script>|<link\s+rel=["']stylesheet["']\s+href=["'](.+?)["']\s*\/?>/g;
  // 替换匹配到的 <script> 和 <link> 标签
  let encrptyScriptContent = [];
  htmlContent = updatedHTML.replace(scriptRegex, (match, scriptSrc, linkHref) => {
    if (scriptSrc) {
      // 如果是 <script> 标签，读取 JS 文件并内联
      const jsFilePath = path.join(rootPath, scriptSrc);
      if (enptyScriptFile.includes(scriptSrc)) {
        let jsFile = fs.readFileSync(jsFilePath, 'utf8');
        encrptyScriptContent.push(jsFile);
        return '';
      }
      const jsContent = fs.readFileSync(jsFilePath, 'utf8');
      return `<script>\n${jsContent}\n</script>`;
    } else if (linkHref) {
      const cssFilePath = path.join(rootPath, linkHref);
      const cssContent = fs.readFileSync(cssFilePath, 'utf8');
      return `<style>\n${cssContent}\n</style>`;
    }
  });
  const dom2 = new JSDOM(htmlContent)
  dom2.window.document.getElementById('encrpty').textContent += `var encrptyScript = '${await encrypt(JSON.stringify(encrptyScriptContent), me)}';`


  // let str= dom2.serialize()

  // // 匹配字符串lock: false,改成lock: true,
  // str = 

  // 将修改后的内容写回 index.html 或另存为新文件
  fs.writeFileSync(path.join(__dirname + '/dist', outputFileName), dom2.serialize().replace(/lock: false/g, 'lock: true'), 'utf8');
  console.log('打包完成');
}
main()