const sharp = require("sharp");

function popupInfoMessage(message) {
  const span = document.querySelector('#message-info > span')
  span.textContent = message
  document.querySelector('#container_message-info').style.display = 'grid'
}

async function compressAndConvert({ img, format, quality, name }) {
  const [filename, _extname] = await name.split('.')
  const timeStamp = Date.now()
  await sharp(img)
    .withMetadata()
    .toFormat(format, { quality: quality, progressive: true, force: false })
    .toFile(`./build/${timeStamp}-${filename}.${format}`)
    .catch(err => popupInfoMessage(`${err}`))
    .then((_info) => {
      popupInfoMessage('File converted successfully')
    })
}

window.addEventListener('DOMContentLoaded', () => {
  // Form
  const form = document.querySelector('#form')
  const inputFile = document.querySelector('#file-upload')
  const inputFileFormat = document.querySelector('#file-format')
  const inputPercentage = document.querySelector('#percentage')
  const inputPercentageText = document.querySelector('#percentage-text')
  // Onchange text input percentage
  inputPercentageText.textContent = `${inputPercentage.value}%`
  inputPercentage.onchange = () => {
    inputPercentageText.textContent = `${inputPercentage.value}%`
  }
  // Bind fake button with input file
  const fakeBtn = document.querySelector('#fake-btn')
  fakeBtn.onclick = inputFile.click()
  // OnChange msg file input
  const msgInputFile = document.querySelector('#message_input-file')
  inputFile.onchange = () => {
    const length = inputFile.files.length
    if (length === 1) {
      const filename = inputFile.files[0].name
      msgInputFile.textContent = filename
    } else {
      msgInputFile.textContent = `${length} files selected`
    }
  }
  // Drag and Drop
  const containerInputFile = document.querySelector('#container_input-file')
  inputFile.ondragenter = () => {
    containerInputFile.classList.add('active')
  }
  inputFile.ondragleave = () => {
    containerInputFile.classList.remove('active')
  }
  // Button reset form
  const btnResetForm = document.querySelector('#btn-reset-form')
  const containerMessageInfo = document.querySelector('#container_message-info')
  const handleReset = () => {
    msgInputFile.textContent = 'or drag and drop files here'
    form.reset()
    containerMessageInfo.children[0].children[0].textContent = ''
    containerMessageInfo.style.display = 'none'
    inputPercentageText.textContent = `${inputPercentage.value}%`
  }
  btnResetForm.onclick = handleReset

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const files = Object.values(inputFile.files)
    const isFileSupported = files.every(file => file.type.includes('image'))
    if (!isFileSupported) {
      popupInfoMessage('One or more files is not supported')
    } else {
      const percentage = Number(inputPercentage.value)
      const format = inputFileFormat.value
      files.forEach(async ({ name, path }) => {
        await compressAndConvert({ img: path, format: format, quality: percentage, name: name })
      })
    }
  })
})
