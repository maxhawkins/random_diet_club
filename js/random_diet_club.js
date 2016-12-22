var logos = [
    'img/pear.png'
];

var logo = document.getElementById("logo");
var logoIdx = Math.floor(Math.random() * logos.length);
logo.src = logos[logoIdx];

APNG.ifNeeded().then(function() {

    APNG.animateImage(logo);
});

var lastScrollY = 0;
function updateScrollY() {
    lastScrollY = window.scrollY;
}

// called on RAF
function collapseNavbar() {
    if (lastScrollY > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
}

$(window).scroll(updateScrollY);
$(document).ready(updateScrollY);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 800, 'swing');
        event.preventDefault();
    });
});


// MailChimp subscribe form

function submitForm($form) {
    return $.ajax({
        type: 'GET',
        url: 'https://club.us14.list-manage.com/subscribe/post-json?c=?',
        data: $form.serialize(),
        cache: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
    });
}

function showMessage(msg, msgType) {
  var $msgWrapper = $('#msg-wrapper'),
      $msgContainer = $msgWrapper.find('.label'),
      msgClass = msgType === 'success' ? 'label-primary' : 'label-error';

  $msgContainer.addClass(msgClass);
  $msgContainer.text(msg);
  $msgWrapper.show();
}

function clearMessage() {
  var $msgWrapper = $('#msg-wrapper'),
      $msgContainer = $msgWrapper.find('.label');

  $msgWrapper.hide();
  $msgContainer.removeClass('label-primary label-error');
  $msgContainer.text('');
}

$(function() {
    var $form = $('form');

    $form.submit(function(e) {
        e.preventDefault();

        clearMessage();

        var $submit = $form.find('[type="submit"]')
        $submit.addClass('loading');
        $submit.attr('disabled', true);

        submitForm($form)
            .then(function(resp) {
                $submit.removeClass('loading');
                $submit.attr('disabled', false);

                if (resp.result === 'success') {
                  var successMsg = "Welcome to the club! Please verify your email to complete your registration.";
                  $form.hide();
                  showMessage(successMsg, resp.result);
                }
                else {
                  showMessage(resp.msg, resp.result);
                }

            }, function(err) {
                var errorMsg = 'Send failed. Please try again.';
                $submit.removeClass('loading');
                $submit.attr('disabled', false);
                showMessage(errorMsg, 'error');
            });
    });
});






////////////
// Physics Simulation
////////////


// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector,
    Runner = Matter.Runner,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

var bodies = [];
var images = [];

var particles = document.getElementById('particles');
var downloadSection = document.getElementById('download');
var aboutSection = document.getElementById('about');

var launchY = downloadSection.offsetTop - aboutSection.offsetTop;

var SRCS = [
    'img/basil.png',
    'img/eggplant.png',
    'img/cabbage.png',
    'img/cabbage2.png',
    'img/salad.png',
    'img/cucumber.png',
    'img/apple.png',
    'img/grape.png',
];

for (var i = 0; i < 20; i++) {

    var body = Bodies.rectangle(
        -300 * 50,
        launchY * 50,
        100,
        100,
        {
            friction: 0,
            frictionAir: 0.008,
        });
    body.isSensor = true;
    body.collisionFilter.category = 2;
    bodies.push(body);

    var maxWidth = 200;
    if (document.body.offsetWidth < 500) {
        maxWidth = 150;
    }

    var scale = 0.8 + (Math.random() - 0.5) * 0.3;
    var width = maxWidth * scale;

    var srcIdx = Math.floor(Math.random() * SRCS.length);
    var src = SRCS[srcIdx];

    var image = document.createElement('img');
    image.className = 'particle'
    image.src = src;
    image.style.width = width + 'px';
    image.style.transform = 'translate(-9999, -9999)';
    particles.appendChild(image);
    images.push(image);
}

engine.world.gravity.y = 0;
World.add(engine.world, bodies);

var runner = Runner.create();

function allSleeping(bodies) {
    var sleepingCount = 0;

    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];

        if (body.speed < 0.01 && body.angularSpeed < 0.01) {
            sleepingCount++;
        }
    }

    return sleepingCount == bodies.length;
}

function updateImages(bodies) {
    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        var image = images[i];

        var x = (body.position.x / 50);
        var y = (body.position.y / 50);

        var tran = 'translate3d(' + x + 'px, ' + y + 'px, 0) ' +
            'rotate(' + body.angle + 'rad)';

        image.style.transform = tran;
    }
}

function update(t) {
    Runner.tick(runner, engine, 1000 / 60);

    var bodies = Composite.allBodies(engine.world);

    if (triggered && !allSleeping(bodies)) {
        updateImages(bodies);
    }

    collapseNavbar();

    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);


function trigger() {
    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];

        var forceScale = 11;
        if (document.body.offsetWidth < 500) {
            forceScale = 3;
        }

        var position = {
            x: -300 * 50,
            y: launchY * 50,
        }
        var origin = {
            x: position.x - 20,
            y: position.y,
        };
        var force = {
            x: (Math.sqrt(Math.random()) + 0.5) * forceScale,
            y: (Math.random() - 0.5) * (forceScale + 3),
        };

        if (Math.random() > 0.5) {
            position.x = (window.innerWidth + 300) * 50;
            origin.x = position.x + 12;
            force.x *= -1;
        }

        Body.setPosition(body, position);
        Body.applyForce(body, origin, force);
    }

    update();

    for (var i = 0; i < images.length; i++) {
        images[i].style.display = 'block';
    }
}

var triggered = false;
$(window).scroll(function() {
    if (triggered) {
        return;
    }
    var position = window.scrollY + window.innerHeight;
    var triggerPoint = downloadSection.offsetTop;
    if (position < triggerPoint || position > (triggerPoint + 600)) {
        return
    }
    triggered = true;
    trigger();
});
