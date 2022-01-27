document.getElementById("addrolebtnpopup").addEventListener("click",function() {
  document.querySelector('.roleoverlayout').style.display = 'flex';
})


document.querySelector(".closeaddrole").addEventListener("click",function() {
    document.querySelector('.roleoverlayout').style.display = 'none';

})

window.addEventListener('keydown', (e)=> {
    if(e.key =='Escape') {
        document.querySelector('.roleoverlayout').style.display = 'none';
    }        
    })