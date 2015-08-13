var NavalBattle = (function navalBattle(){
  var navy5Cor = [],
      navy4Cor = [],
      navy4Cor_ = [],
      navy3Cor = [],
      navy3Cor_ = [],
      navy2Cor = [],
      navy2Cor_ = [];

  var username = "";

  var socket = io.connect();

  function setUsername() {
     username = "luisma";//(prompt('Please enter your name') || 'User') + (new Date().getTime());
     // username = (prompt('Please enter your name') || 'User') + (new Date().getTime());
    $('#username').html(username);
  }

  function buildFloats() {
    $('#myField table#table').on('click', 'td', function() {
      var $td = $(this);
      creatingMyField($td);
    });
  }

  function attackEnemyFloats (argument) {
    $('#myField table#table-to-attack').on('click', 'td', function() {
      var $td = $(this);
      $td.addClass('attack')
      attack($td);
    });
  }

  function listenAttacks() {
    socket.on('new attack', function(data){
      receiveAttack(data);
    });
  }

  function creatingMyField(element) {
    if (navy5Cor.length != 5) {
      setNavy(navy5Cor, 5, element);
      navy5Cor = navy5Cor.sort();
    }else{
      $('#label-message').html("Ready. Go to fight! Attack!");
      $('#table-to-attack').show();
    }
  }

  function setNavy(navy, length, element) {
    if (navy.length < length) {
      if(verifyNavyPosition(element.data('cor'), length, navy) == true){
        element.addClass('navy');
        navy[navy.length] = element.data('cor');
      }
    }
  }

  function attack(element) {
    socket.emit('send attack', {username: username, position_to_attack: element.data('cor')});
  }

  function receiveAttack(data) {
    var $element = $('#myField table#table td[data-cor="'+data.position_to_attack+'"]');
    if (data.username !== username) {
      if ( noConfoundCells(data.position_to_attack) ) {
        $element.html("X");
      }else{
        $element.addClass('attack-losed');
      }
    }
  }

  function verifyNavyPosition(newPosition, navyLength, navyPositions) {
    if(navyPositions.length === 0){
      return true;
    }
    if (navyPositions.length < navyLength) {
      lastPosition = navyPositions[navyPositions.length - 1];
      if ( !noConfoundCells(newPosition) ) {
        if( nextTo(getNumbers(lastPosition), getNumbers(newPosition) ) ||
            beforeTo(getNumbers(navyPositions[0]), getNumbers(newPosition) ) ){
          if (lastPosition[0] === newPosition[0] ) {
            return true;
          }
        }
      }
    }
  }

  function noConfoundCells(position) {
    var result = false;
    [navy5Cor, navy4Cor, navy4Cor_, navy3Cor, navy3Cor_, navy2Cor, navy2Cor_].map(function(elem) {
      if (elem.indexOf(position) != -1) {
        result = true;
      }
    });
    return result;
  }

  function nextLetterTo(){}

  function beforeLetterTo(){}

  function nextTo(number, newNumber) {return (newNumber == (number + 1)); }

  function beforeTo(number, newNumber) {return (newNumber == (number - 1)); }

  function getNumbers(string) {return parseInt(string.match(/\d+/)[0], 10); }

  function init() {
    buildFloats();
    attackEnemyFloats();
    listenAttacks();
    setUsername();
  }

  return {
    init: init
  }
})();