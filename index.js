// funcao para renderizar o metodo Get
function renderTransition(transitionData){
    const transition = document.createElement('article')
    transition.classList.add('transition')
    transition.id = `article-${transitionData.id}`

    const name = document.createElement('h3')
    name.classList.add('transition-name')
    name.textContent = transitionData.name

    const value = document.createElement('div')
    value.classList.add('transition-value')
    value.innerHTML = transitionData.value

    const content = document.createElement('div')
    content.classList.add('transition-date')
    content.textContent = transitionData.content

    transition.append(name,value,content)
    document.querySelector('#transitions').appendChild(transition)
}
// funcao para pegar dados do servidor atravez do metodo get
async function fetchTransitions(){
    const transitions = await fetch('http://localhost:3000/transitions').then(res => res.json())
    transitions.forEach(renderTransition)
}


// Metodo post para o formulario
const form = document.querySelector('form')

form.addEventListener('submit',async (ev) => {
    ev.preventDefault()

    const balanceFormat = parseFloat(document.querySelector('#value').value)

    const transitionData = {
        name: document.querySelector('#name').value,
        value: balanceFormat,
        content: document.querySelector('#content').value
    }

    const response = await fetch('http://localhost:3000/transitions',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body:JSON.stringify(transitionData)
    })

    const savedTransition = await response.json()
    renderTransition(savedTransition)
    noRenderUser()
    fetchUser()
    limparForm()
})
function limparForm(){
    document.querySelector('#name').value = ""
    document.querySelector('#value').value = ""
    document.querySelector('#content').value = ""
}
// criando uma funcao para mostrar o saldo 
function renderUser(userData){

    const user = document.createElement('article')
    user.classList.add('user-article')
    user.id = `user-article`

    const name = document.createElement('div')
    name.classList.add('name-user')
    name.textContent = userData.name

    const balance = document.createElement('div')
    balance.classList.add('balance-user')
    balance.textContent = userData.balance

    user.append(name,balance)
    document.querySelector('#user').appendChild(user)
}

function noRenderUser(){
    document.querySelector('#user').removeChild(document.querySelector('#user-article'))
}


async function fetchUser(){
    const user = await fetch('http://localhost:3000/user').then(res => res.json())
    const transitions = await fetch('http://localhost:3000/transitions').then(res=> res.json())
    const valueTransitions = transitions.reduce((sum,transition)=> sum+ transition.value,0)
    user.balance = user.balance - valueTransitions
    renderUser(user)
}

document.addEventListener('DOMContentLoaded', (ev) => {
    ev.preventDefault()
    fetchTransitions()
    fetchUser()
    
})

//Removendo transacao
const buttonRemove = document.querySelector('#remove')

buttonRemove.addEventListener('click',async (ev) => {
    ev.preventDefault()
    const idRemove = document.querySelector('#id-remove').value
    document.querySelector('#transitions').removeChild(document.querySelector(`#article-${idRemove}`))
    await fetch(`http://localhost:3000/transitions/${idRemove}`,{
        method:'DELETE',
        headers:{
            'Content-type': 'application/json'
        }
    })
    noRenderUser()
    fetchUser()
})


