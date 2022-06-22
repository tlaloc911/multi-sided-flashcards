let intervalID =0;
let remainingTime =0;
let toPick=20;
let toTick = true;
let toTack = true;
let toTock = true;

// Displays a specific card and side
function loadCard(set_id, side_num, card_num, total_cards, sides, cards, side_order) {
    let nextSide = side_num+1 < sides.length ? sides[side_order[side_num+1]] : sides[side_order[1]];
    if ($('.card').length) {
        $("#nextSideText").text("Next: " + nextSide);
        $("#sideProgress").text("Side " + side_num + "/" + String(sides.length-1));
        $(".card-title").text(sides[side_order[side_num]]);
        $(".card-text").text(cards[card_num][side_order[side_num]]);
    } else {
        $("#body").load(" #bodyRow",
            function (response, status, xhr) {
                if (status == "error") {
                    console.log("Error occured");
                    var msg = "Sorry but there was an error: ";
                    $("#body").html(msg + xhr.status + " " + xhr.statusText);
                } else {
                    $("#nextSideText").text("Next: " + nextSide);
                    $("#sideProgress").text("Side " + side_num + "/" + String(sides.length-1));
                    $(".card-title").text(sides[side_order[side_num]]);
                    $(".card-text").text(cards[card_num][side_order[side_num]]);
                }
            });
    }
    $("#progress-bar")
        .css("width", (card_num+1)/total_cards*100 + "%")
        .attr("aria-valuenow", (card_num+1)/total_cards*100)
        .text(card_num+1 + "/" + total_cards + " cards studied");
}

// Displays "studying complete" UI
function loadDone(set_id, total_cards) {


    if (intervalID!=0)
    {
        window.clearInterval(intervalID);
        intervalID=0;
        document.getElementById('play').textContent = "Play";

    }


    $("#body").load("../../api/study_done?set=" + set_id,
        function( response, status, xhr ) {
            if ( status == "error" ) {
                console.log("Error occured");
                var msg = "Oops, there was an error: ";
                $( "#body" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        });
    $("#progress-bar")
        .css("width", "100%")
        .attr("aria-valuenow", 100)
        .text("All cards studied!");
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

$(document).ready(function(){
    let pathArray = window.location.pathname.split('/');
    let max_occur = pathArray.length;
    let set_id = pathArray[Number(max_occur-2)];
    let total_sides, total_cards, sides, cards, cards_shuffled;
    let total_total_cards;

    let side_order = {};
    let side_time = {};
    $.get("../../api/set_info?set=" + set_id, function(data, status){
        if ( status == "error" ) {
            console.error("Error occured: " + xhr.status + " " + xhr.statusText);
        } else {
            total_sides = data.num_sides;
            total_cards = data.num_cards;
            total_total_cards = total_cards;
            sides = data.sides;
            cards = data.cards;
            cards_shuffled = cards;
            for (i=1; i<=total_sides; i++) {
                side_order[i] = i;
                side_time[i]=10;
                document.getElementById('sideTime' + i).value = side_time[i]
            }

        }
    });
    let side_num = 1;
    let card_num = 0;


    document.getElementById('checkSecond').checked = toTick;
    document.getElementById('checkSide').checked = toTack;
    document.getElementById('checkCard').checked = toTock;


    let el = document.getElementById('sideList');
    let sortable = Sortable.create(el, {animation: 150});

    // Modal (side re-ordering)
    $("#settingsModal").on("click", "#saveChanges", function() {
        sortable.save()
        let arr = sortable.toArray();
        arr.map((currElement, index) => {
            side_order[index+1] = currElement;
        });

        let textinput = document.getElementById('toPick').value;

        toTick = document.getElementById('checkSecond').checked;
        toTack = document.getElementById('checkSide').checked;
        toTock = document.getElementById('checkCard').checked;

        toPick = 20;
        if(textinput)
        {
            if (!isNaN(textinput))
            {
                toPick = parseInt(textinput);
            }
        }

        for(i=1;i<=total_sides;i++)
        {

            let textinput = document.getElementById('sideTime' + i).value;
            let seconds = 10;
            if(textinput)
            {
                if (!isNaN(textinput))
                {
                    seconds = parseInt(textinput);
                }
            }
            side_time[side_order[i]]= seconds;
        }

        restart();

        $('#settingsModal').modal('hide');
    });

    // $("#toPick").value=toPick;
    document.getElementById("toPick").value = toPick;

    // Card/Side navigation
    function nextCard() {
        // console.log("clicking nextCard");
        card_num++;
        side_num=1;
        // console.log({card_num: card_num, total_cards: total_cards});
        if (card_num >= total_cards) {
            loadDone(set_id, total_cards);
            card_num = total_cards;
            return;
        }
        loadCard(set_id, side_num, card_num, total_cards, sides, cards_shuffled, side_order);
        remainingTime= side_time[side_num];
        drawRemaining();
    }
    function prevCard() {
        // console.log("clicking prevCard");
        card_num--;
        side_num=1;
        if (card_num < 0) {
            card_num = 0;
            return;
        }
        loadCard(set_id, side_num, card_num, total_cards, sides, cards_shuffled, side_order);
        remainingTime= side_time[side_num];
        drawRemaining();
    }
    function nextSide() {
        // console.log("clicking nextSide");
        // console.log({side_num: side_num, total_sides: total_sides});
        if (card_num == total_cards) return;
        side_num++;
        if (side_num > total_sides) {
            side_num = 1; // loops around
        }
        loadCard(set_id, side_num, card_num, total_cards, sides, cards_shuffled, side_order);
        remainingTime= side_time[side_num];
        drawRemaining();
    }
    function prevSide() {
        if (card_num == total_cards) return;
        side_num--;
        if (side_num < 1) {
            side_num = total_sides; // loops around
        }
        loadCard(set_id, side_num, card_num, total_cards, sides, cards_shuffled, side_order);
        remainingTime= side_time[side_num];
        drawRemaining();
    }
    function restart() {
        // console.log("clicking restart");
        side_num = 1;
        card_num = 0;
        loadCard(set_id, side_num, card_num, total_cards, sides, cards_shuffled, side_order);
        remainingTime= side_time[side_num];
        drawRemaining();

        if (intervalID!=0)
        {
            window.clearInterval(intervalID);
            intervalID=0;
            document.getElementById('play').textContent = "Play";
        }

    }


    function selectButtom(buttname)
    {
        document.getElementById('reset').classList.remove('btn-primary');
        document.getElementById('shuffle').classList.remove('btn-primary');
        document.getElementById('pick').classList.remove('btn-primary');
        document.getElementById('play').classList.remove('btn-primary');

        document.getElementById('reset').classList.remove('btn-light');
        document.getElementById('shuffle').classList.remove('btn-light');
        document.getElementById('pick').classList.remove('btn-light');
        document.getElementById('play').classList.remove('btn-light');


        document.getElementById(buttname).classList.add('btn-primary');
    }

    function drawRemaining()
    {
        let bar = document.getElementById('timer');
        bar.style.width = (remainingTime/side_time[side_num]*100) + "%";
        bar.innerText = remainingTime+ " secs";
    }

    function shuffle() {
        // console.log("shuffling cards");
        shuffleArray(cards_shuffled);
        restart();

        selectButtom('pick');

        
    }

    function reset() {
        console.log("restoring");
        cards_shuffled = cards;
        total_cards = total_total_cards;
        restart();

        selectButtom('shuffle');

    }
        
    function pick() {
        if (total_total_cards > toPick)
        {

            total_cards=toPick;
            restart();
        }

        selectButtom('play');

    }

    function play() {

        if (intervalID!=0)
        {
            window.clearInterval(intervalID);
            intervalID=0;
            document.getElementById('play').textContent = "Play";
            selectButtom('play');


        }
        else
        {
            if (remainingTime==0) // to start the first time but take from current if unpaused
            {
                remainingTime= side_time[side_num] + 1;
            }
            intervalID = window.setInterval(Playing, 1000);
            document.getElementById('play').textContent = "Pause";
            selectButtom('reset');

        }

    }



    function Playing() {

        if (remainingTime>1)
        {
            remainingTime--;
            if(toTick)
            {
                tick_sound.play();
            }
        }
        else
        {
            do
            {
                if(side_num < total_sides)
                {
                    nextSide();
                    if(side_time[side_num]>0)
                    {
                        if(toTack)
                        {
                            tack_sound.play();
                        }
                        else
                        {
                            if(toTick)
                            {
                                tick_sound.play();
                            }
                        }
                    }
                }
                else
                {
                    nextCard();
                    if(side_time[side_num]>0)
                    {
                        if(toTock)
                        {
                        tock_sound.play();
                        }
                        else
                        {
                            if(toTack)
                            {
                                tack_sound.play();
                            }
                            else
                            {
                                if(toTick)
                                {
                                    tick_sound.play();
                                }
                            }
                        }
                    }
                }
            } while(side_time[side_num]==0 );

            remainingTime= side_time[side_num];
        }

        drawRemaining();
    
    }
  

    // set click handlers
    $("#body").on("click", "#nextCard", function() {
        nextCard()
    });
    $("body").on("click", "#prevCard", function() {
        prevCard()
    });
    $("#body").on("click", "#nextSide", function() {
        nextSide()
    });
    $("#body").on("click", "#prevSide", function() {
        prevSide()
    });
    $("#body").on("click", "#restart", function() {
        restart()
    });
    $("#options").on("click", "#shuffle", function() {
        shuffle();
    });
    $("#options").on("click", "#reset", function() {
        reset();
    });
    $("#options").on("click", "#pick", function() {
        pick();
    });
    $("#options").on("click", "#play", function() {
        play();
    });

    // set key handlers
    $(document).keydown(function (e) {
        var key = { left: 37, up: 38, right: 39, down: 40, R: 82, S: 83 };

        switch (e.which) {
            case key.left:
                prevCard();
                break;
            case key.up:
                prevSide();
                break;
            case key.right:
                nextCard();
                break;
            case key.down:
                nextSide();
                break;
            case key.R:
                restart();
                break;
            case key.S:
                shuffle();
                break;
        }
    });



    const tick_sound = document.getElementById('tick_sound');
    const tack_sound = document.getElementById('tack_sound');
    const tock_sound = document.getElementById('tock_sound');




});