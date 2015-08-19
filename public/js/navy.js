var Navy = (function(){

  // navies[0] => 5 positions
  // navies[1] => 4 positions
  // navies[2] => 4 positions
  // navies[3] => 3 positions
  // navies[4] => 3 positions
  // navies[5] => 2 positions
  // navies[6] => 2 positions

  var navies = [[],[],[],[],[],[],[]],
      username, socket;

  function buildNavies() {
    var selectorTable = "#myField table#table";
    var $td
        , $table
        , queryElements
        , navyPositions
        , directionNavies = queryElementsByPositionVertically
        , length = 5;

    var markingPositionsNavy = function markingPositionsNavy(context) {
      clearMarksNavies();
      $td = $(context);
      $table = $td.parents('table');
      infoElements = directionNavies($td.data('cor'), length);
      navyPositions = infoElements.positions;
      queryElements = infoElements.queryElements;
      markNavies($td, $table, length, queryElements);
    }

    $(selectorTable).on('mousedown', 'td[data-cor]', function(event) {
      if(event.which === 2){
        if (directionNavies === queryElementsByPositionHorizontally){
          directionNavies = queryElementsByPositionVertically;
          markingPositionsNavy(this);
        }else{
          directionNavies = queryElementsByPositionHorizontally;
          markingPositionsNavy(this);
        }
      };
    });

    $(selectorTable).on('mouseover', 'td[data-cor]', function() {
      markingPositionsNavy(this);
    });

    $(selectorTable).on('click', 'td', function() {
      if (length !== 0 && !noConfoundCells( $td.data('cor') )){
        if (navies[0].length === 0 ) {
          setNavy($table, queryElements);
          navies[0] = navyPositions;
          length = 4;
        }else if (navies[1].length === 0) {
          setNavy($table, queryElements);
          navies[1] = navyPositions;
          length = 4;
        }else if (navies[2].length === 0) {
          setNavy($table, queryElements);
          navies[2] = navyPositions;
          length = 3;
        }else if (navies[3].length === 0) {
          setNavy($table, queryElements);
          navies[3] = navyPositions;
          length = 3;
        }else if (navies[4].length === 0) {
          setNavy($table, queryElements);
          navies[4] = navyPositions;
          length = 2;
        }else if (navies[5].length === 0) {
          setNavy($table, queryElements);
          navies[5] = navyPositions;
          length = 2;
        }else if (navies[6].length === 0) {
          setNavy($table, queryElements);
          navies[6] = navyPositions;
          $('#table-to-attack').show();
          startAttack();
          length = 0;
        }
      }
    });
    return navyPositions;
  };

  function clearMarksNavies() {
    $('table#table').find('td[data-cor]').removeClass('select-position');
  }

  function markNavies(element, elementTable, length, queryElements) {
    var tableParent;
    if (length !== 0 && !noConfoundCells( element.data('cor') ) ) {
      elementTable.find(queryElements).addClass('select-position');
    };
  }

  function setNavy(parent, child) {
    parent.find(child).addClass('selected-position');
  }

  function queryElementsByPositionVertically(position, length) {

    var number = getNumbers(position),
        letter = getLetters(position),
        queryElements = 'td[data-cor="'+ (letter + number) +'"]'+ (length !== 1 ? ',' : '') +'',
        positions = [(letter + number)];

    if ((number + length) <= 11) {
      for (var i = 1; i < length; i++) {
        positions[positions.length] = (letter + (number+i));
        if (i === (length - 1)) {
          queryElements += 'td[data-cor="'+ (letter + (number+i)) +'"]';
        }else{
          queryElements += 'td[data-cor="'+ (letter + (number+i)) +'"],'
        }
      };
    }else{
      queryElements = "";
    }
    return {
      queryElements: queryElements,
      positions: positions
    };
  };

  function queryElementsByPositionHorizontally(position, length) {
    var letter = getLetters(position),
        number = getNumbers(position),
        queryElements = '',
        positions = [position];

    var letters = lettersNextToPosition(letter, length);

    if ( letters.indexOf(null) === -1 ) {
      letters.forEach(function(letterPosition, index){

        positions[positions.length] = (letterPosition + (number));

        if (letterPosition === letters[letters.length - 1]) {
          queryElements += 'td[data-cor="'+ (letterPosition + (number)) +'"]';
        }else{
          queryElements += 'td[data-cor="'+ (letterPosition + (number)) +'"],'
        }

      });
    }else{
      queryElements = "";
    };
    return {
      queryElements: queryElements,
      positions: positions
    };
  };

  function lettersNextToPosition(letter, length) {
    var result = [letter];
    for (var i = 1; i < length; i++) {
      if (result !== null) {
        result[result.length] = letterNextTo(result[result.length - 1]);
      };
    };
    return result;
  };

  function letterNextTo(letter) {
    switch(letter){
      case "A": return "B"; break;
      case "B": return "C"; break;
      case "C": return "D"; break;
      case "D": return "E"; break;
      case "E": return "F"; break;
      case "F": return "G"; break;
      case "G": return "H"; break;
      case "H": return "I"; break;
      case "I": return "J"; break;
      case "J": return null; break;
      default: null; break;
    };
  };

  function setUsername() {
    username = "user" + (new Date().getTime());
    // username = (prompt('Please enter your name') || 'User') + (new Date().getTime());
    $('#username').html(username);
  }

  function startAttack() {
    socket = io.connect();

    var selectorTable = "#myField table#table-to-attack";

    $(selectorTable).on('click', 'td', function() {
      attack( $(this).data('cor') );
    });

    listenAttacks();
  }

  function attack(position) {
    socket.emit('send_attack', { username: username, position_to_attack: position });
  }

  function listenAttacks() {
    socket.on('listen_attack', function(data){
      receiveAttack(data);
    });
    socket.on('received_attack?', function(data){
      receivedAttack(data);
    });
  }

  function receiveAttack(data) {
    var result = false,
        destroyed = false;
    var $element = $('#myField table#table td[data-cor="'+data.position_to_attack+'"]');

    if (data.username !== username) {

      navies.map(function(elem) {
        if (elem.indexOf(data.position_to_attack) != -1) { result = true; }
      });

      if (result) {
        $element.html("X");
        destroyed = true;
      }else{
        $element.addClass('attack-losed');
      }

      socket.emit('received_attack', { username: data.username, position_to_attack: data.position_to_attack, destroyed: destroyed });

    }
  }

  function receivedAttack(data){
    if (data.username === username){
      if (data.destroyed) {
        $('#attack-received').html('destroyed navy on '+ data.position_to_attack +' position.');
      }else{
        $('#attack-received').html('the other user will attack.');
      };
      destroy(data.destroyed, data.position_to_attack);
    };
  }

  function destroy(destroyed, position) {
    if (destroyed) {
      $('table#table-to-attack').find('td[data-cor="'+ position +'"]').addClass('destroyed');
    }else{
      $('table#table-to-attack').find('td[data-cor="'+ position +'"]').addClass('attack');
    };
  }

  function noConfoundCells(position) {
    var result = false;
    if (typeof position === "object") {
      position.forEach(function(element, index){
        navies.map(function(elem) {
          if (elem.indexOf(element) != -1) { result = true; }
        });
      });
    }else{
      navies.map(function(elem) {
        if (elem.indexOf(position) != -1) { result = true; }
      });
    };
    return result;
  }

  function getNumbers(string) { return parseInt(string.match(/\d+/)[0], 10); };

  function getLetters(string) { return string.match(/[A-Za-z]/)[0]; };

  function init(){
    setUsername();
    buildNavies();
  };

  return {
    init: init,
    queryElementsByPositionHorizontally: queryElementsByPositionHorizontally
  };
})();
