// Any pixels above this threshold will be set to 255
const COLOR_THRESHOLD = 175;

// The trained MNIST Model
var model;

async function loadModel() {
    model = await tf.loadGraphModel('MNIST_Network/TFJS/model.json');
    console.log(model);
}

function getBoundingRect(contours, width, height){
    var min_x = width;
    var min_y = height;
    var max_x = 0;
    var max_y = 0;
    for(let i = 0; i < contours.size(); ++i){
        var cntRect = cv.boundingRect(contours.get(i));

        min_x = Math.min(cntRect.x, min_x);
        min_y = Math.min(cntRect.y, min_y);
        max_x = Math.max(cntRect.x + cntRect.width, max_x);
        max_y = Math.max(cntRect.y + cntRect.height, max_y);
    }

    let rect = new cv.Rect(min_x, min_y, max_x-min_x, max_y-min_y);
    return rect;
}

function getContourCentroids(contours) {
    var m10 = 0.0;
    var m01 = 0.0;
    var m00 = 0.0;
    for(let i = 0; i < contours.size(); ++i){
        let cnt = contours.get(i);
        const Moments = cv.moments(cnt, false);
        m10 += Moments.m10;
        m01 += Moments.m01;
        m00 += Moments.m00;
    }
    const cx = m10 / m00;
    const cy = m01 / m00;

    return [cx, cy];
}

function predictImage() {
    // Read image from canvas
    let image = cv.imread(canvas);
    var height = image.rows;
    var width = image.cols;

    // Flatten color channels and threshold pixels
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 1);
    cv.threshold(image, image, COLOR_THRESHOLD, 255, cv.THRESH_BINARY);

    // Find picture's contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    // Early Termination if the user hasn't drawn on the board
    if(contours.size() == 0){
        image.delete();
        contours.delete();
        hierarchy.delete();
        return -1;
    }

    // Calculate bounding rectangle around drawn image and crop image to this rectangle
    // (Identically to how the origional MNIST digits were processed for the MNIST model)
    let rectBound = getBoundingRect(contours, width, height);

    // focus on bounded contour rectangle
    image = image.roi(rectBound);

    // Need to adjust the image to 20x20 pixels, as done in the MNIST dataset
    height = image.rows;
    width = image.cols;
    if(height > width){
        height = 20;
        const scaleFactor = image.rows / height;
        width = Math.round(image.cols / scaleFactor);
    } else {
        width = 20;
        const scaleFactor = image.cols / width;
        height = Math.round(image.rows / scaleFactor);
    }

    let dsize = new cv.Size(width, height);
    cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);

    // Pad the image by 4, to expand the image to a 28x28 image.
    const leftPad  = Math.ceil( 4 + (20 - width) / 2);
    const rightPad = Math.floor(4 + (20 - width) / 2);
    const topPad   = Math.ceil( 4 + (20 - height) / 2);
    const botPad   = Math.floor(4 + (20 - height) / 2);

    const BLACK = new cv.Scalar(0,0,0,0);
    cv.copyMakeBorder(image, image, topPad, botPad, leftPad, rightPad, cv.BORDER_CONSTANT, BLACK);

    // Find the Centroid (Center of Mass) of the image over all contours
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE)
    var centroid = getContourCentroids(contours);
    const cx = centroid[0];
    const cy = centroid[1];

    // Shift the image to the Center of Mass of the image
    const xShift = Math.round(image.cols/2.0 - cx);
    const yShift = Math.round(image.rows/2.0 - cy);
    dsize = new cv.Size(image.cols, image.rows);
    const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, xShift, 0, 1, yShift]);
    cv.warpAffine(image, image, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);

    // Normalize our image
    let pixelData = image.data;
    
    pixelData = Float32Array.from(pixelData);
    pixelData = pixelData.map(function(item){
        return item / 255.0;
    });

    // Create a tensor of the preprocessed image data --> model accepts shape: (1,784) of dtype: float32
    const X = tf.tensor([pixelData]);

    // Predict the input!
    const result = model.predict(X);

    // Get prediction from tensor
    const output = result.dataSync()[0];

    // Testing
    //const outputCanvas = document.createElement('CANVAS');
    //cv.imshow(outputCanvas, image);
    //document.body.appendChild(outputCanvas);

    // Cleanup
    image.delete();
    contours.delete();
    hierarchy.delete();
    M.delete();

    // Tensors need to explicitly be cleaned up in tf.js
    X.dispose();
    result.dispose();

    return output;
}