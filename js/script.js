const menuBtn = document.querySelector('#menu-btn');
const searchBtn = document.querySelector('#search-btn');
const nav = document.querySelector('nav');
const scrollBtn = document.querySelector('#scroll-btn');
const body = document.body;

// Welcome page animation

document.addEventListener('DOMContentLoaded', () => {
    
    // Welcome animation
    anime.timeline({
        targets: '#welcome',
        easing: 'easeOutExpo',
    })
    .add({
        width: ['0vw', '100vw'],
        opacity: 1,
        duration: 1200,
    })
    .add({
        delay: 2700,
        translateX: '100vw',
        duration: 1500,
        complete: function(anime) {
            document.querySelector('#welcome').remove();
        }
    })

    // heading animation
    anime({
        targets: '#heading',
        delay: 400,
        opacity: 1,
        duration: 1800,
        translateY: ['-30px', '0px'],
        easing: 'easeOutExpo',
    })

    // subheading animation
    anime({
        targets: '#sub-heading',
        delay: 600,
        opacity: 1,
        duration: 1800,
        translateY: ['-30px', '0px'],
        easing: 'easeOutExpo',
    })

    //welcome loader-wrapper
    anime({
        targets: '#loader-wrapper',
        opacity: 1,
        easing: 'easeOutExpo',
        duration: 1800,
        delay: 1500,
    })

    //welcome loader animation
    anime({
        targets: '#loader',
        opacity: 1,
        easing: 'easeOutExpo',
        duration: 2300,
        delay: 2000,
        width: ['0%', '100%'],
    })

    // menu button animation
    anime({
        targets: '#menu-btn',
        opacity: 1,
        easing: 'easeInExpo',
        duration: 1300,
        delay: 5400,
    })

})

// Event listeners

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('show-menu');
    nav.classList.toggle('show-hide-shadow');
    document.querySelector('#img-container').classList.toggle('translate-img-container');
})

searchBtn.addEventListener('click', getValues);
searchBtn.addEventListener('click', () => {
    nav.classList.toggle('show-menu');
    nav.classList.toggle('show-hide-shadow');
    document.querySelector('#img-container').classList.remove('translate-img-container');
})

// window scroll function
let calcScrollValue = () => { 
    let scrollBtn = document.getElementById('scroll-btn');
    let progressValue = document.getElementById('progress-value');
    let pos = document.documentElement.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight;
    let clientHeight = document.documentElement.clientHeight;
    let calcHeight = scrollHeight - clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);
    
    if (pos > 100) {
        scrollBtn.style.display = 'grid';
    }
    else {
        scrollBtn.style.display = 'none';
    }

    scrollBtn.addEventListener('click', () => {
        document.documentElement.scrollTop = 0;
    })

    scrollBtn.style.background = `conic-gradient(#5C258D ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;

// loading animation
const loader = document.querySelector('#loading');
loader.style.width = '4rem';
loader.style.height = '4rem';
loader.style.border = '8px solid #f3f3f3';
loader.style.borderTop = '9px solid hsl(260, 100%, 70%)';
loader.style.borderRadius = '50%';
loader.style.margin = 'auto';
loader.style.position = 'relative';
loader.style.top = '100px';
loader.style.visibility = 'hidden';

const loadingAnimation = anime({
    targets: '#loading',
    rotate: 360,
    visibility: 'visible',
    duration: 500,
    direction: 'normal',
    easing: 'linear',
    loop: true,
    autoplay: true,
})

// Functions

// Input function
function getValues(event){
    event.preventDefault();

    const textInput = document.querySelector('#text');
    let text = textInput.value.toLowerCase();
    textInput.value = '';

    const sortInput = document.querySelector('#sort');
    let sortSelection = sortInput.value;

    const numberInput = document.querySelector('#per-page');
    let numberOfPhotos = numberInput.value;
    numberInput.value = null;

    fetchInputs(text, sortSelection, numberOfPhotos);
}

// Fetch function
function fetchInputs(text, sortSelection, numberOfPhotos){
    displayLoading();
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=1846fc257b2e6121083f60a245d29e4c&text=${text}&sort=${sortSelection}&per_page=${numberOfPhotos}&format=json&nojsoncallback=1`;
    
    fetch(url)
    .then(response => {
        if(text == ''){
            hideLoading();
            throw 'Sorry, we could not find anything. Please write something in the search bar and try again.';
        }
        else if(numberOfPhotos == ''){
            hideLoading();
            throw 'Sorry, we could not find anything. Please select a number of pictures and try again.';
        }
        else if(response.status >= 200 && response.status < 300){
            hideLoading();
            return response.json();
        }
    })
    .then(displayImages)
    .catch(error => alert(error))
}

// Function that displays the images
function displayImages(imageData){
    console.log(imageData)
    if (imageData.photos.total == 0) {
        alert('Sorry, we could not find anything with that name. Please try again.')
    }
    const imgContainer = document.querySelector('#img-container');
    imgContainer.innerHTML = '';

    const photoArray = imageData.photos.photo;
    const defaultSizeInput = document.getElementById('medium');
    defaultSizeInput.defaultChecked = true;

    const imgSizeInput = document.querySelector('input[name=img-size]:checked');
    let imgSize = imgSizeInput.value;

    for(let i=0; i<photoArray.length; i++){

        let id = photoArray[i].id;
        let server = photoArray[i].server;
        let secret = photoArray[i].secret;
        const getImageUrl = `
        https://live.staticflickr.com/${server}/${id}_${secret}_${imgSize}.jpg`;
        
        const img = document.createElement('img');
        img.src = getImageUrl;
        img.classList.add('photo')
        imgContainer.append(img);
 
    }
    anime({
        targets: '.photo',
        delay: anime.stagger(100),
        duration: 250,
        translateX: ['2000px', '0px'],
        scale: ['0', '1'],
    })
    
}

// show/hide loading animation functions
function displayLoading() {
    loader.style.visibility = 'visible';
}

function hideLoading() {
    loader.style.visibility = 'hidden';
}

// show/hide scroll button function
function scrollFunction(){
    if (body.scrollTop > 50) {
        scrollBtn.style.display = 'block';
    }
    else {
        scrollBtn.style.display = 'none';
    }
}
