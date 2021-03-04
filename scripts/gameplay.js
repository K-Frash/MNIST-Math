var answer;
var score = 0;
var backgroundImages = [];
var correctCol = "#06d6a0";
var incorrectCol = "#ef476f";
var predictCol = "#f2cc8f";

function nextQuestion(){
    const n1 = Math.floor(Math.random() * 5);
    const n2 = Math.floor(Math.random() * 6);

    document.getElementById('n1').innerHTML = n1;
    document.getElementById('n2').innerHTML = n2;

    answer = n1 + n2;
}

function verifyAnswer(){
    const prediction = predictImage();

    if(prediction == -1){
        document.getElementById('n3').innerHTML = `I Couldn't Recognize an Answer, Try Again!`;
        return false;
    } else if(prediction == answer){
        score++;
        backgroundImages.push(`url('images/background${score % 6}.svg')`);
        document.body.style.backgroundImage = backgroundImages;
        document.getElementById('n3').innerHTML = `Your Answer of <span style="color:${predictCol}"> ${prediction}</span> was Correct, <span style="color:${correctCol}"> Your Garden Blooms!</span>`;
    } else {
        score = Math.max(0, score - 1);
        backgroundImages.pop();
        document.body.style.backgroundImage = backgroundImages;
        document.getElementById('n3').innerHTML= `Your Answer of <span style="color:${predictCol}"> ${prediction}</span> was Incorrect, <span style="color:${incorrectCol}"> Your Garden Wilts!</span>`;
    }

    return true;
}