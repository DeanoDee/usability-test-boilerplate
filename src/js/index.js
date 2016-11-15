const data = {
    text: "hello Bob"
}

$(function() {
    const {text} = data;
    const template = test(text);
    $('.carousel-inner h1').html(template)
});