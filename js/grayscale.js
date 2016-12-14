// jQuery to collapse the navbar on scroll
function collapseNavbar() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
}

$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

var bodies = [];
var images = [];

var particles = document.getElementById('particles');

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

    var body = Bodies.rectangle(-300 * 50, 1200 * 50, 100, 100, {friction: 0, frictionAir: 0.008});
    bodies.push(body);

    var scale = 0.8 + (Math.random() - 0.5) * 0.3;
    var width = 200 * scale;

    var srcIdx = Math.floor(Math.random() * SRCS.length);
    var src = SRCS[srcIdx];

    var image = document.createElement('img');
    image.className = 'particle'
    image.src = src;
    image.style.position = 'absolute';
    image.style.left = 0;
    image.style.top = 0;
    image.style.width = width + 'px';
    image.style.transform = 'translate(-9999, -9999)';
    particles.appendChild(image);
    images.push(image);
}

engine.world.gravity.y = 0;
World.add(engine.world, bodies);


Engine.run(engine);

function update(t) {
    var bodies = Composite.allBodies(engine.world);

    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        var image = images[i];

        var x = (body.position.x / 50);
        var y = (body.position.y / 50);

        var tran = 'translate(' + x + 'px, ' + y + 'px) ' +
            'rotate(' + body.angle + 'rad)';

        image.style.transform = tran;
    }


    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);


function trigger() {
    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];

        var position = {
            x: -300 * 50,
            y: 1200 * 50,
        }
        var origin = {
            x: position.x - 20,
            y: position.y,
        };
        var force = {
            x: (Math.sqrt(Math.random()) + 0.5) * 12,
            y: (Math.random() - 0.5) * 15,
        };

        if (Math.random() > 0.5) {
            position.x = (window.innerWidth + 300) * 50;
            origin.x = position.x + 12;
            force.x *= -1;
        }

        Body.setPosition(body, position);
        Body.applyForce(body, origin, force);
    }
}

var downloadSection = document.getElementById('download');

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
    setTimeout(trigger, 1000);
});

