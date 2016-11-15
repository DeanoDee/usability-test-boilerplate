const data = {
    text: "hello world"
}

$(function() {
    const {text} = data;
    const template = test(text);
    $('.carousel-inner h1').html(template)
});