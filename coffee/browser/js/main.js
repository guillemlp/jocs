(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Ast, checkSemantics, compile, execute, interpreter, parser, setOutput, util;

util = require('util');

parser = require('../../parser/grammar.jison').parser;

checkSemantics = require('../../semantics/').checkSemantics;

interpreter = require('../../interpreter/');

Ast = require('../../parser/ast.coffee');

parser.yy = {
  Ast: Ast
};

compile = function(code) {
  var ast;
  ast = parser.parse(code);
  return checkSemantics(ast);
};

execute = function(ast) {
  interpreter.load(ast);
  return interpreter.run();
};

setOutput = function(s) {
  return $("#output").html(s);
};

$(function() {
  var codeMirror;
  codeMirror = CodeMirror((function(elt) {
    return $("#code").replaceWith(elt);
  }), {
    value: "int main() {\n\n}",
    theme: "material"
  });
  $("#compile").click(function() {
    var ast, code, error, error1, ref;
    code = codeMirror.getValue();
    try {
      ast = compile(code);
    } catch (error1) {
      error = error1;
      setOutput("<b>Compilation Error</b><br/>" + ((ref = error.stack) != null ? ref : error.message));
      return;
    }
    return setOutput("<b>No compilation errors</b><br/>" + (JSON.stringify(ast, null, 4)));
  });
  return $("#run").click(function() {
    var ast, code, error, error1, error2, ref, ref1, ref2, status, stdout;
    code = codeMirror.getValue();
    try {
      ast = compile(code);
    } catch (error1) {
      error = error1;
      setOutput("<b>Compilation Error</b><br/>" + ((ref = error.stack) != null ? ref : error.message));
      return;
    }
    try {
      ref1 = execute(ast), stdout = ref1.stdout, status = ref1.status;
    } catch (error2) {
      error = error2;
      setOutput("<b>Execution Error</b><br/>" + ((ref2 = error.stack) != null ? ref2 : error.message));
    }
    return setOutput("<b>Exit Status:<b/> " + status + "<br/><b>Output:</b><br/>" + stdout);
  });
});


},{"../../interpreter/":3,"../../parser/ast.coffee":4,"../../parser/grammar.jison":5,"../../semantics/":6,"util":15}],2:[function(require,module,exports){
var InterpretationError, assert, copy, e,
  slice = [].slice;

assert = require('assert');

module.exports = this;

copy = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

this.InterpretationError = InterpretationError = (function() {
  function InterpretationError(code1, message1) {
    this.code = code1;
    this.message = message1;
  }

  InterpretationError.prototype.complete = function() {
    var index, others, placeHolder, ref, ret, text;
    placeHolder = arguments[0], text = arguments[1], others = 3 <= arguments.length ? slice.call(arguments, 2) : [];
    others.unshift(placeHolder, text);
    ret = copy(this);
    while (others.length > 0) {
      ref = others, placeHolder = ref[0], text = ref[1], others = 3 <= ref.length ? slice.call(ref, 2) : [];
      placeHolder = "<<" + placeHolder + ">>";
      index = ret.message.indexOf(placeHolder);
      assert(index > 0);
      ret.message = ret.message.replace(placeHolder, text);
    }
    return ret;
  };

  return InterpretationError;

})();

e = (function(_this) {
  return function(name, code, message) {
    return _this[name] = new InterpretationError(code, message);
  };
})(this);

e("VARIABLE_REDEFINITION", 10, "Cannot define variable <<name>>: already defined in this scope");

e("GET_VARIABLE_NOT_DEFINED", 11, "Cannot get variable <<name>>: not defined in this scope");

e("SET_VARIABLE_NOT_DEFINED", 12, "Cannot set variable <<name>>: not defined in this scope");

e("FUNCTION_REDEFINITION", 13, "Cannot define function <<name>>: already defined");

e("VOID_FUNCTION_ARGUMENT", 14, "Cannot define a function argument with void type: function <<function>>, argument <<argument>>");

e("FUNCTION_UNDEFINED", 15, "Cannot call function <<name>>, variable is not declared");

e("CALL_NON_FUNCTION", 16, "Cannot call <<name>>, which is not a function");

e("INVALID_PARAMETER_COUNT_CALL", 17, "Function <<name>> with <<good>> parameters has been called with wrong number of parameters <<wrong>>");

e("VOID_DECLARATION", 30, "Cannot declare a variable with type void: variable <<name>>");

e("INVALID_CAST", 20, "Cannot cast type <<origin>> to type <<dest>>");

e("GET_VARIABLE_NOT_ASSIGNED", 0, "Cannot get variable <<name>>: hasn't been assigned");


},{"assert":10}],3:[function(require,module,exports){



},{}],4:[function(require,module,exports){
var Ast, assert;

assert = require('assert');

module.exports = Ast = (function() {
  Ast.TYPES = Object.freeze({
    VOID: 'VOID',
    INT: 'INT',
    DOUBLE: 'DOUBLE',
    STRING: 'STRING',
    CHAR: 'CHAR',
    BOOL: 'BOOL',
    FUNCTION: 'FUNCTION'
  });

  Ast.OPERATORS = Object.freeze({
    PLUS: 'PLUS',
    MINUS: 'MINUS',
    UPLUS: 'UPLUS',
    UMINUS: 'UMINUS',
    MUL: 'MUL',
    DIV: 'DIV',
    MOD: 'MOD',
    LT: '<',
    GT: '>',
    LTE: '<=',
    GTE: '>=',
    EQ: '==',
    NEQ: '!='
  });

  Ast.LITERALS = Object.freeze({
    INT: 'INT_LIT',
    DOUBLE: 'DOUBLE_LIT',
    BOOL: 'BOOL_LIT',
    CHAR: 'CHAR_LIT',
    STRING: 'STRING_LIT'
  });

  Ast.STATEMENTS = Object.freeze({
    IF_THEN: 'IF-THEN',
    IF_THEN_ELSE: 'IF-THEN-ELSE',
    WHILE: 'WHILE',
    FOR: 'FOR',
    RETURN: 'RETURN',
    CIN: 'CIN',
    COUT: 'COUT'
  });

  Ast.NODES = Object.freeze({
    BLOCK_FUNCTIONS: 'BLOCK-FUNCTIONS',
    BLOCK_INSTRUCTIONS: 'BLOCK-INSTRUCTIONS',
    ARG_LIST: 'ARG-LIST',
    ARG: 'ARG',
    ID: 'ID',
    DECLARATION: 'DECLARATION',
    FUNCALL: 'FUNCALL',
    ASSIGN: 'ASSIGN',
    PARAM_LIST: 'PARAM-LIST'
  });

  Ast.CASTS = Object.freeze({
    INT2DOUBLE: 'INT2DOUBLE',
    INT2CHAR: 'INT2CHAR',
    INT2BOOL: 'INT2BOOL',
    DOUBLE2INT: 'DOUBLE2INT',
    DOUBLE2CHAR: 'DOUBLE2CHAR',
    DOUBLE2BOOL: 'DOUBLE2BOOL',
    CHAR2INT: 'CHAR2INT',
    CHAR2BOOL: 'CHAR2BOOL',
    CHAR2DOUBLE: 'CHAR2DOUBLE',
    BOOLTOINT: 'BOOLTOINT',
    BOOLTODOUBLE: 'BOOLTODOUBLE',
    BOOLTOCHAR: 'BOOLTOCHAR'
  });

  function Ast(type, children) {
    this.type = type;
    this.children = children;
    assert(typeof this.type === "string");
    assert(Array.isArray(this.children));
  }

  Ast.prototype.getType = function() {
    return this.type;
  };

  Ast.prototype.cast = function(casting) {
    var currentChildren, currentType;
    currentType = this.type;
    currentChildren = this.children;
    this.type = casting;
    return this.children = [new Ast(currentType, currentChildren)];
  };

  Ast.prototype.getChild = function(i) {
    return this.children[i];
  };

  Ast.prototype.getChildren = function() {
    return this.children;
  };

  Ast.prototype.addChild = function(child) {
    return this.children.push(child);
  };

  Ast.prototype.getChildCount = function() {
    return this.children.length;
  };

  return Ast;

})();


},{"assert":10}],5:[function(require,module,exports){
(function (process){
/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[5,54,55,56,57,58,59],$V1=[1,6],$V2=[1,7],$V3=[1,8],$V4=[1,9],$V5=[1,10],$V6=[1,11],$V7=[1,13],$V8=[11,15],$V9=[14,19,29,33,36,37,39,42,54,55,56,57,58,59,76],$Va=[2,10],$Vb=[1,32],$Vc=[1,41],$Vd=[1,37],$Ve=[1,38],$Vf=[1,39],$Vg=[1,44],$Vh=[1,45],$Vi=[14,19,29,33,36,37,38,39,42,54,55,56,57,58,59,76],$Vj=[11,19],$Vk=[1,53],$Vl=[1,54],$Vm=[1,55],$Vn=[1,56],$Vo=[1,57],$Vp=[1,58],$Vq=[1,59],$Vr=[1,70],$Vs=[1,62],$Vt=[1,61],$Vu=[1,63],$Vv=[1,64],$Vw=[1,65],$Vx=[1,66],$Vy=[1,67],$Vz=[11,15,19],$VA=[1,92],$VB=[1,93],$VC=[1,94],$VD=[1,95],$VE=[1,96],$VF=[1,97],$VG=[1,98],$VH=[1,99],$VI=[1,100],$VJ=[1,101],$VK=[1,102],$VL=[11,15,19,41,44,60,61,62,63,64,65,66,67,68,69,70],$VM=[11,19,41],$VN=[11,19,44],$VO=[1,136],$VP=[11,15,19,41,44,60,61,65,66,67,68,69,70],$VQ=[11,15,19,41,44,65,66,67,68,69,70],$VR=[11,15,19,41,44,69,70];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"prog":3,"block_functions":4,"EOF":5,"function":6,"type":7,"id":8,"(":9,"arg_list":10,")":11,"{":12,"block_instr":13,"}":14,",":15,"arg":16,"instruction":17,"basic_stmt":18,";":19,"if":20,"while":21,"for":22,"funcall":23,"return_stmt":24,"block_assign":25,"declaration":26,"cin":27,"cout":28,"RETURN":29,"expr":30,"param_list":31,"param":32,"IF":33,"instruction_body":34,"else":35,"WHILE":36,"FOR":37,"ELSE":38,"CIN":39,"block_cin":40,">>":41,"COUT":42,"block_cout":43,"<<":44,"ENDL":45,"assign":46,"EQUAL":47,"+=":48,"-=":49,"*=":50,"/=":51,"%=":52,"declaration_body":53,"INT":54,"DOUBLE":55,"CHAR":56,"BOOL":57,"STRING":58,"VOID":59,"PLUS":60,"MINUS":61,"MUL":62,"DIV":63,"MOD":64,"<":65,">":66,"<=":67,">=":68,"==":69,"!=":70,"DOUBLE_LIT":71,"INT_LIT":72,"CHAR_LIT":73,"BOOL_LIT":74,"STRING_LIT":75,"ID":76,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",9:"(",11:")",12:"{",14:"}",15:",",19:";",29:"RETURN",33:"IF",36:"WHILE",37:"FOR",38:"ELSE",39:"CIN",41:">>",42:"COUT",44:"<<",45:"ENDL",47:"EQUAL",48:"+=",49:"-=",50:"*=",51:"/=",52:"%=",54:"INT",55:"DOUBLE",56:"CHAR",57:"BOOL",58:"STRING",59:"VOID",60:"PLUS",61:"MINUS",62:"MUL",63:"DIV",64:"MOD",65:"<",66:">",67:"<=",68:">=",69:"==",70:"!=",71:"DOUBLE_LIT",72:"INT_LIT",73:"CHAR_LIT",74:"BOOL_LIT",75:"STRING_LIT",76:"ID"},
productions_: [0,[3,2],[4,2],[4,0],[6,8],[10,3],[10,1],[10,0],[16,2],[13,2],[13,0],[17,2],[17,1],[17,1],[17,1],[17,2],[17,2],[17,1],[18,1],[18,1],[18,1],[18,1],[24,2],[23,4],[31,3],[31,1],[31,0],[32,1],[20,6],[20,5],[21,5],[22,9],[35,2],[27,2],[40,3],[40,2],[28,2],[43,3],[43,3],[43,2],[43,2],[34,1],[34,3],[25,3],[25,1],[46,3],[46,3],[46,3],[46,3],[46,3],[46,3],[26,2],[53,3],[53,3],[53,1],[53,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[30,3],[30,3],[30,3],[30,3],[30,3],[30,2],[30,2],[30,3],[30,3],[30,3],[30,3],[30,3],[30,3],[30,1],[30,1],[30,1],[30,1],[30,1],[30,1],[30,1],[30,3],[8,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return $$[$0-1]; 
break;
case 2: case 5: case 9: case 24: case 34: case 37: case 38: case 43:
this.$.addChild($$[$0]);
break;
case 3:
this.$ = new yy.Ast('BLOCK-FUNCTIONS', []);
break;
case 4:
this.$ = new yy.Ast('FUNCTION',[$$[$0-7],$$[$0-6],$$[$0-4],$$[$0-1]]);
break;
case 6:
this.$ = new yy.Ast('ARG-LIST', [$$[$0]]);
break;
case 7:
this.$ = new yy.Ast('ARG-LIST', []);
break;
case 8:
this.$ = new yy.Ast('ARG', [$$[$0-1], $$[$0]]);
break;
case 10:
this.$ = new yy.Ast('BLOCK-INSTRUCTIONS', []);
break;
case 17:
this.$ = new yy.Ast('NOP', []);
break;
case 22:
this.$ = new yy.Ast('RETURN', [$$[$0]]);
break;
case 23:
this.$ = new yy.Ast('FUNCALL', [$$[$0-3],$$[$0-1]]);
break;
case 25:
this.$ = new yy.Ast('PARAM-LIST', [$$[$0]]);
break;
case 26:
this.$ = new yy.Ast('PARAM-LIST', []);
break;
case 27: case 32: case 33: case 36:
this.$ = $$[$0];
break;
case 28:
this.$ = new yy.Ast('IF-THEN-ELSE', [$$[$0-3], $$[$0-1], $$[$0]]);
break;
case 29:
this.$ = new yy.Ast('IF-THEN', [$$[$0-2], $$[$0]]);
break;
case 30:
this.$ = new yy.Ast('WHILE', [$$[$0-2], $$[$0]]);
break;
case 31:
this.$ = new yy.Ast('FOR', [$$[$0-6], $$[$0-4], $$[$0-2], $$[$0]])
break;
case 35:
this.$ = new yy.Ast('CIN', [$$[$0]]);
break;
case 39: case 40:
this.$ = new yy.Ast('COUT', [$$[$0]]);
break;
case 41:
this.$ = new yy.Ast('BLOCK-INSTRUCTIONS', [$$[$0]]);
break;
case 42:
this.$ = $$[$0-1];
break;
case 44:
this.$ = new yy.Ast('BLOCK-ASSIGN', [$$[$0]]);
break;
case 45:
this.$ = new yy.Ast('ASSIGN', [$$[$0-2], $$[$0]]);
break;
case 46:
this.$ = new yy.AstNode('ASSIGN', [$$[$0-2], new yy.AstNode('PLUS', [$$[$0-2],$$[$0]])]);
break;
case 47:
this.$ = new yy.AstNode('ASSIGN', [$$[$0-2], new yy.AstNode('MINUS', [$$[$0-2],$$[$0]])]);
break;
case 48:
this.$ = new yy.AstNode('ASSIGN', [$$[$0-2], new yy.AstNode('MUL', [$$[$0-2],$$[$0]])]);
break;
case 49:
this.$ = new yy.AstNode('ASSIGN', [$$[$0-2], new yy.AstNode('DIV', [$$[$0-2],$$[$0]])]);
break;
case 50:
this.$ = new yy.AstNode('ASSIGN', [$$[$0-2], new yy.AstNode('MOD', [$$[$0-2],$$[$0]])]);
break;
case 51:
this.$ = new yy.Ast('DECLARATION', [$$[$0-1], $$[$0]]);
break;
case 52: case 53:
this.$.push($$[$0]);
break;
case 54: case 55:
this.$ = [$$[$0]];
break;
case 56:
 this.$ = 'INT' 
break;
case 57:
 this.$ = 'DOUBLE' 
break;
case 58:
 this.$ = 'CHAR' 
break;
case 59:
 this.$ = 'BOOL' 
break;
case 60:
 this.$ = 'STRING' 
break;
case 61:
 this.$ = 'VOID' 
break;
case 62:
this.$ = new yy.Ast('PLUS', [$$[$0-2],$$[$0]]);
break;
case 63:
this.$ = new yy.Ast('MINUS', [$$[$0-2],$$[$0]]);
break;
case 64:
this.$ = new yy.Ast('MUL', [$$[$0-2],$$[$0]]);
break;
case 65:
this.$ = new yy.Ast('DIV', [$$[$0-2],$$[$0]]);
break;
case 66:
this.$ = new yy.Ast('MOD', [$$[$0-2],$$[$0]]);
break;
case 67:
this.$ = new yy.Ast('UMINUS', [$$[$0]]);
break;
case 68:
this.$ = new yy.Ast('UPLUS', [$$[$0]]);
break;
case 69:
this.$ = new yy.Ast('<', [$$[$0-2],$$[$0]]);
break;
case 70:
this.$ = new yy.Ast('>', [$$[$0-2],$$[$0]]);
break;
case 71:
this.$ = new yy.Ast('<=', [$$[$0-2],$$[$0]]);
break;
case 72:
this.$ = new yy.Ast('>=', [$$[$0-2],$$[$0]]);
break;
case 73:
this.$ = new yy.Ast('==', [$$[$0-2],$$[$0]]);
break;
case 74:
this.$ = new yy.Ast('!=', [$$[$0-2],$$[$0]]);
break;
case 75:
this.$ = new yy.Ast('DOUBLE_LIT', [$$[$0]]);
break;
case 76:
this.$ = new yy.Ast('INT_LIT', [$$[$0]]);
break;
case 77:
this.$ = new yy.Ast('CHAR_LIT', [$$[$0]])
break;
case 78:
this.$ = new yy.Ast('BOOL_LIT', [$$[$0]]);
break;
case 79:
this.$ = new yy.Ast('STRING_LIT', [$$[$0]]);
break;
case 83:
this.$ = new yy.Ast('ID', [$$[$0]]);
break;
}
},
table: [o($V0,[2,3],{3:1,4:2}),{1:[3]},{5:[1,3],6:4,7:5,54:$V1,55:$V2,56:$V3,57:$V4,58:$V5,59:$V6},{1:[2,1]},o($V0,[2,2]),{8:12,76:$V7},{76:[2,56]},{76:[2,57]},{76:[2,58]},{76:[2,59]},{76:[2,60]},{76:[2,61]},{9:[1,14]},o([9,11,15,19,41,44,47,48,49,50,51,52,60,61,62,63,64,65,66,67,68,69,70],[2,83]),o($V8,[2,7],{10:15,16:16,7:17,54:$V1,55:$V2,56:$V3,57:$V4,58:$V5,59:$V6}),{11:[1,18],15:[1,19]},o($V8,[2,6]),{8:20,76:$V7},{12:[1,21]},{7:17,16:22,54:$V1,55:$V2,56:$V3,57:$V4,58:$V5,59:$V6},o($V8,[2,8]),o($V9,$Va,{13:23}),o($V8,[2,5]),{7:43,8:40,14:[1,24],17:25,18:26,19:$Vb,20:27,21:28,22:29,23:30,24:31,25:33,26:34,27:35,28:36,29:$Vc,33:$Vd,36:$Ve,37:$Vf,39:$Vg,42:$Vh,46:42,54:$V1,55:$V2,56:$V3,57:$V4,58:$V5,59:$V6,76:$V7},o($V0,[2,4]),o($V9,[2,9]),{19:[1,46]},o($Vi,[2,12]),o($Vi,[2,13]),o($Vi,[2,14]),{19:[1,47]},{19:[1,48]},o($Vi,[2,17]),o($Vj,[2,18],{15:[1,49]}),o($Vj,[2,19]),o($Vj,[2,20]),o($Vj,[2,21]),{9:[1,50]},{9:[1,51]},{9:[1,52]},{9:$Vk,47:$Vl,48:$Vm,49:$Vn,50:$Vo,51:$Vp,52:$Vq},{8:68,9:$Vr,23:69,30:60,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},o($Vz,[2,44]),{8:73,46:72,53:71,76:$V7},{40:74,41:[1,75]},{43:76,44:[1,77]},o($Vi,[2,11]),o($Vi,[2,15]),o($Vi,[2,16]),{8:79,46:78,76:$V7},{8:68,9:$Vr,23:69,30:80,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:81,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{7:43,8:79,18:82,25:33,26:34,27:35,28:36,39:$Vg,42:$Vh,46:42,54:$V1,55:$V2,56:$V3,57:$V4,58:$V5,59:$V6,76:$V7},o($V8,[2,26],{8:68,23:69,31:83,32:84,30:85,9:$Vr,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7}),{8:68,9:$Vr,23:69,30:86,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:87,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:88,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:89,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:90,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:91,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{19:[2,22],60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK},{8:68,9:$Vr,23:69,30:103,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:104,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},o($VL,[2,75]),o($VL,[2,76]),o($VL,[2,77]),o($VL,[2,78]),o($VL,[2,79]),o($VL,[2,80],{9:$Vk}),o($VL,[2,81]),{8:68,9:$Vr,23:69,30:105,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},o($Vj,[2,51],{15:[1,106]}),o($Vz,[2,54]),o($Vz,[2,55],{47:$Vl,48:$Vm,49:$Vn,50:$Vo,51:$Vp,52:$Vq}),o($Vj,[2,33],{41:[1,107]}),{8:68,9:$Vr,23:69,30:108,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},o($Vj,[2,36],{44:[1,109]}),{8:68,9:$Vr,23:69,30:110,45:[1,111],60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},o($Vz,[2,43]),{47:$Vl,48:$Vm,49:$Vn,50:$Vo,51:$Vp,52:$Vq},{11:[1,112],60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK},{11:[1,113],60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK},{19:[1,114]},{11:[1,115],15:[1,116]},o($V8,[2,25]),o($V8,[2,27],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK}),o($Vz,[2,45],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK}),o($Vz,[2,46],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK}),o($Vz,[2,47],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK}),o($Vz,[2,48],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK}),o($Vz,[2,49],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK}),o($Vz,[2,50],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK}),{8:68,9:$Vr,23:69,30:117,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:118,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:119,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:120,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:121,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:122,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:123,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:124,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:125,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:126,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},{8:68,9:$Vr,23:69,30:127,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},o($VL,[2,67]),o($VL,[2,68]),{11:[1,128],60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK},{8:130,46:129,76:$V7},{8:68,9:$Vr,23:69,30:131,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},o($VM,[2,35],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK}),{8:68,9:$Vr,23:69,30:132,45:[1,133],60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},o($VN,[2,39],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK}),o($VN,[2,40]),{7:43,8:40,12:$VO,17:135,18:26,19:$Vb,20:27,21:28,22:29,23:30,24:31,25:33,26:34,27:35,28:36,29:$Vc,33:$Vd,34:134,36:$Ve,37:$Vf,39:$Vg,42:$Vh,46:42,54:$V1,55:$V2,56:$V3,57:$V4,58:$V5,59:$V6,76:$V7},{7:43,8:40,12:$VO,17:135,18:26,19:$Vb,20:27,21:28,22:29,23:30,24:31,25:33,26:34,27:35,28:36,29:$Vc,33:$Vd,34:137,36:$Ve,37:$Vf,39:$Vg,42:$Vh,46:42,54:$V1,55:$V2,56:$V3,57:$V4,58:$V5,59:$V6,76:$V7},{8:68,9:$Vr,23:69,30:138,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},o($VL,[2,23]),{8:68,9:$Vr,23:69,30:85,32:139,60:$Vs,61:$Vt,71:$Vu,72:$Vv,73:$Vw,74:$Vx,75:$Vy,76:$V7},o($VP,[2,62],{62:$VC,63:$VD,64:$VE}),o($VP,[2,63],{62:$VC,63:$VD,64:$VE}),o($VL,[2,64]),o($VL,[2,65]),o($VL,[2,66]),o($VQ,[2,69],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE}),o($VQ,[2,70],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE}),o($VQ,[2,71],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE}),o($VQ,[2,72],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE}),o($VR,[2,73],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI}),o($VR,[2,74],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI}),o($VL,[2,82]),o($Vz,[2,52]),o($Vz,[2,53],{47:$Vl,48:$Vm,49:$Vn,50:$Vo,51:$Vp,52:$Vq}),o($VM,[2,34],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK}),o($VN,[2,37],{60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK}),o($VN,[2,38]),o($V9,[2,29],{35:140,38:[1,141]}),o($Vi,[2,41]),o($V9,$Va,{13:142}),o($Vi,[2,30]),{19:[1,143],60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI,69:$VJ,70:$VK},o($V8,[2,24]),o($Vi,[2,28]),{7:43,8:40,12:$VO,17:135,18:26,19:$Vb,20:27,21:28,22:29,23:30,24:31,25:33,26:34,27:35,28:36,29:$Vc,33:$Vd,34:144,36:$Ve,37:$Vf,39:$Vg,42:$Vh,46:42,54:$V1,55:$V2,56:$V3,57:$V4,58:$V5,59:$V6,76:$V7},{7:43,8:40,14:[1,145],17:25,18:26,19:$Vb,20:27,21:28,22:29,23:30,24:31,25:33,26:34,27:35,28:36,29:$Vc,33:$Vd,36:$Ve,37:$Vf,39:$Vg,42:$Vh,46:42,54:$V1,55:$V2,56:$V3,57:$V4,58:$V5,59:$V6,76:$V7},{7:43,8:79,18:146,25:33,26:34,27:35,28:36,39:$Vg,42:$Vh,46:42,54:$V1,55:$V2,56:$V3,57:$V4,58:$V5,59:$V6,76:$V7},o($Vi,[2,32]),o($Vi,[2,42]),{11:[1,147]},{7:43,8:40,12:$VO,17:135,18:26,19:$Vb,20:27,21:28,22:29,23:30,24:31,25:33,26:34,27:35,28:36,29:$Vc,33:$Vd,34:148,36:$Ve,37:$Vf,39:$Vg,42:$Vh,46:42,54:$V1,55:$V2,56:$V3,57:$V4,58:$V5,59:$V6,76:$V7},o($Vi,[2,31])],
defaultActions: {3:[2,1],6:[2,56],7:[2,57],8:[2,58],9:[2,59],10:[2,60],11:[2,61]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* ignore comment */
break;
case 1:/* ignore multiline comment */
break;
case 2:/* skip whitespace */
break;
case 3:return 62
break;
case 4:return 63
break;
case 5:return 61
break;
case 6:return 64
break;
case 7:return 60
break;
case 8:return 44
break;
case 9:return 41
break;
case 10:return 66
break;
case 11:return 65
break;
case 12:return 68
break;
case 13:return 67
break;
case 14:return 70
break;
case 15:return 69
break;
case 16:return 48
break;
case 17:return 49
break;
case 18:return 50
break;
case 19:return 51
break;
case 20:return 52
break;
case 21:return 47
break;
case 22:return 19
break;
case 23:return 12
break;
case 24:return 14
break;
case 25:return 9
break;
case 26:return 11
break;
case 27:return 15
break;
case 28:return 29
break;
case 29:return 39
break;
case 30:return 42
break;
case 31:return 45
break;
case 32:return 54
break;
case 33:return 55
break;
case 34:return 56
break;
case 35:return 57
break;
case 36:return 58
break;
case 37:return 59
break;
case 38:return 39
break;
case 39:return 42
break;
case 40:return 33
break;
case 41:return 38
break;
case 42:return 36
break;
case 43:return 37
break;
case 44:return 74
break;
case 45:return 71
break;
case 46:return 72
break;
case 47:return 73
break;
case 48:return 75
break;
case 49:return 76
break;
case 50:return 5
break;
case 51:return 'INVALID'
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:\/\*(.|\n|\r)*?\*\/)/,/^(?:\s+)/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:%)/,/^(?:\+)/,/^(?:<<)/,/^(?:>>)/,/^(?:>)/,/^(?:<)/,/^(?:>=)/,/^(?:<=)/,/^(?:!=)/,/^(?:==)/,/^(?:\+=)/,/^(?:-=)/,/^(?:\*=)/,/^(?:\/=)/,/^(?:%=)/,/^(?:=)/,/^(?:;)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:,)/,/^(?:return\b)/,/^(?:cin\b)/,/^(?:cout\b)/,/^(?:endl\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:bool\b)/,/^(?:string\b)/,/^(?:void\b)/,/^(?:cin\b)/,/^(?:cout\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:while\b)/,/^(?:for\b)/,/^(?:true|false\b)/,/^(?:[0-9]+(\.[0-9]+)\b)/,/^(?:([1-9][0-9]*|0))/,/^(?:'(\\.|[^'])')/,/^(?:"(\\.|[^"])*")/,/^(?:([a-z]|[A-Z]|_)([a-z]|[A-Z]|_|[0-9])*)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this,require('_process'))
},{"_process":13,"fs":9,"path":12}],6:[function(require,module,exports){
var typePreprocessor, variableChecker;

variableChecker = require('./variable-checker');

typePreprocessor = require('./type-preprocessor');

module.exports = this;

this.checkSemantics = function(ast) {
  return variableChecker.checkVariables(ast);
};


},{"./type-preprocessor":7,"./variable-checker":8}],7:[function(require,module,exports){
var Ast, Error;

Error = require('../error');

Ast = require('../parser/ast');


},{"../error":2,"../parser/ast":4}],8:[function(require,module,exports){
var Ast, CASTINGS, CASTS, Error, NODES, OPERATORS, TYPE, TYPES, assert, checkAndPreprocess, checkDeclaration, checkVariableDefined, copy, functions, tryToCast;

assert = require('assert');

Ast = require('../parser/ast');

Error = require('../error');

NODES = Ast.NODES, TYPES = Ast.TYPES, OPERATORS = Ast.OPERATORS, CASTS = Ast.CASTS;

CASTINGS = {};

for (TYPE in TYPES) {
  CASTINGS[TYPE] = {};
}

CASTINGS[TYPES.INT][TYPES.DOUBLE] = CASTS.INT2DOUBLE;

CASTINGS[TYPES.INT][TYPES.CHAR] = CASTS.INT2CHAR;

CASTINGS[TYPES.INT][TYPES.BOOL] = CASTS.INT2BOOL;

CASTINGS[TYPES.DOUBLE][TYPES.INT] = CASTS.DOUBLE2INT;

CASTINGS[TYPES.DOUBLE][TYPES.CHAR] = CASTS.DOUBLE2CHAR;

CASTINGS[TYPES.DOUBLE][TYPES.BOOL] = CASTS.DOUBLE2BOOL;

CASTINGS[TYPES.CHAR][TYPES.INT] = CASTS.CHAR2INT;

CASTINGS[TYPES.CHAR][TYPES.DOUBLE] = CASTS.CHAR2DOUBLE;

CASTINGS[TYPES.CHAR][TYPES.BOOL] = CASTS.CHAR2BOOL;

CASTINGS[TYPES.BOOL][TYPES.INT] = CASTS.BOOL2INT;

CASTINGS[TYPES.BOOL][TYPES.DOUBLE] = CASTS.BOOL2DOUBLE;

CASTINGS[TYPES.BOOL][TYPES.CHAR] = CASTS.BOOL2CHAR;

module.exports = this;

functions = {};

copy = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

checkVariableDefined = function(id, definedVariables) {
  if (definedVariables[id] == null) {
    throw Error.GET_VARIABLE_NOT_DEFINED.complete('name', id);
  }
};

checkDeclaration = function(declarationAst, type, definedVariables) {
  var id;
  id = declarationAst.getType() === NODES.ID ? declarationAst.getChild(0) : declarationAst.getChild(0).getChild(0);
  if (definedVariables[id] != null) {
    throw Error.VARIABLE_REDEFINITION.complete('name', id);
  } else {
    return definedVariables[id] = type;
  }
};

tryToCast = function(ast, originType, destType) {
  if (CASTINGS[originType][destType] != null) {
    return ast.cast(CASTINGS[originType][destType]);
  } else {
    throw Error.INVALID_CAST.complete('origin', originType, 'dest', destType);
  }
};

checkAndPreprocess = function(ast, definedVariables, functionId) {
  var actualLength, argType, child, declarationAst, declarations, definedVariablesAux, expectedLength, funcId, i, id, j, k, l, len, len1, len2, len3, m, paramList, ref, ref1, ref2, type, valueAst, valueType, variableId, variableType;
  switch (ast.getType()) {
    case NODES.ID:
      id = ast.getChild(0);
      checkVariableDefined(id, definedVariables);
      return definedVariables[id];
    case NODES.DECLARATION:
      declarations = ast.getChild(1);
      type = ast.getChild(0);
      for (j = 0, len = declarations.length; j < len; j++) {
        declarationAst = declarations[j];
        checkDeclaration(declarationAst, type, definedVariables);
        checkAndPreprocess(declarationAst, definedVariables, functionId);
      }
      return TYPES.VOID;
    case NODES.BLOCK_INSTRUCTIONS:
      definedVariablesAux = copy(definedVariables);
      ref = ast.getChildren();
      for (k = 0, len1 = ref.length; k < len1; k++) {
        child = ref[k];
        if (child instanceof Ast) {
          checkAndPreprocess(child, definedVariablesAux, functionId);
        }
      }
      return TYPES.VOID;
    case NODES.FUNCALL:
      funcId = ast.getChild(0).getChild(0);
      if (definedVariables[funcId] != null) {
        if (definedVariables[funcId] === TYPES.FUNCTION) {
          assert(functions[funcId] != null);
          paramList = ast.getChild(1);
          assert(paramList.getType() === NODES.PARAM_LIST);
          expectedLength = functions[funcId].argTypes.length;
          actualLength = paramList.getChildCount();
          if (actualLength !== expectedLength) {
            throw Error.INVALID_PARAMETER_COUNT_CALL.complete('name', funcId, 'good', expectedLength, 'wrong', actualLength);
          }
          ref1 = functions[funcId].argTypes;
          for (i = l = 0, len2 = ref1.length; l < len2; i = ++l) {
            argType = ref1[i];
            type = checkAndPreprocess(paramList.getChild(i), definedVariables, functionId);
            if (type !== argType) {
              tryToCast(paramList.getChild(i), type, argType);
            }
          }
          return functions[funcId].returnType;
        } else {
          throw Error.CALL_NON_FUNCTION.complete('name', funcId);
        }
      } else {
        throw Error.FUNCTION_UNDEFINED.complete('name', funcId);
      }
      break;
    case NODES.ASSIGN:
      variableId = ast.getChild(0).getChild(0);
      variableType = definedVariables[variableId];
      if (variableType === TYPES.VOID) {
        throw Error.VOID_DECLARATION.complete('name', variableId);
      }
      valueAst = ast.getChild(1);
      valueType = checkAndPreprocess(valueAst, definedVariables, functionId);
      if (valueType !== variableType) {
        tryToCast(valueAst, valueType, variableType);
      }
      return TYPES.VOID;
    default:
      ref2 = ast.getChildren();
      for (m = 0, len3 = ref2.length; m < len3; m++) {
        child = ref2[m];
        if (child instanceof Ast) {
          checkAndPreprocess(child, definedVariables, functionId);
        }
      }
      return TYPES.VOID;
  }

  /*
  when LITERALS.DOUBLE
      return TYPES.DOUBLE
  when LITERALS.INT
      return TYPES.INT
  when LITERALS.STRING
      return TYPES.STRING
  when LITERALS.CHAR
      return TYPES.CHAR
  when LITERALS.BOOL
      return TYPES.BOOL
  when OPERATORS.PLUS, OPERATORS.MINUS, OPERATORS.MUL
       * Comprovar/castejar que els dos tipus siguin iguals, i que siguin
       * o bé integrals (char castejat a int o int o bool cast a int)
       * o bé reals (double). Es casteja de menys tamany a mes sempre, mai al reves
  
       * Retorna tipus el dels dos operands igualats
  when OPERATORS.UPLUS
       * COmprovar/castejar que el tipus sigui
       * o bé integral (char castejat a int o int o bool cast a int)
       * o bé real (double).
  
       * Retorna tipus el del operand
  when OPERATORS.UMINUS
       * COmprovar/castejar que el tipus sigui
       * o bé integral (char castejat a int o int o bool cast a int)
       * o bé real (double).
  when OPERATORS.DIV
       * Comprovar/castejar que els dos tipus siguin iguals, i que siguin
       * o bé integrals (char castejat a int o int o bool cast a int)
       * o bé reals (double). Es casteja de menys tamany a mes sempre, mai al reves
  
       * Es genera una instruccio (sa de canviar el type) DIVREAL si els operands son doubles
       * o DIVINTEGRAL si els operands son ints
  
       * Retorna tipus el dels dos operands igualats (int o double)
  when OPERATORS.MOD
       * Comprovar/castejar que els dos tipus siguin iguals, i que siguin
       * integrals (char castejat a int o int o bool cast a int)
  
       * Retorna tipus int
  when OPERATORS.LT
       * Comprovar/castejar que els dos tipus siguin iguals, i que siguin
       * o bé integrals (char castejat a int o int o bool cast a int)
       * o bé reals (double). Es casteja de menys tamany a mes sempre, mai al reves
  
       * Retorna tipus bool
  when OPERATORS.GT
       * Comprovar/castejar que els dos tipus siguin iguals, i que siguin
       * o bé integrals (char castejat a int o int o bool cast a int)
       * o bé reals (double). Es casteja de menys tamany a mes sempre, mai al reves
  
       * Retorna tipus bool
  when OPERATORS.LTE
       * Comprovar/castejar que els dos tipus siguin iguals, i que siguin
       * o bé integrals (char castejat a int o int o bool cast a int)
       * o bé reals (double). Es casteja de menys tamany a mes sempre, mai al reves
  
       * Retorna tipus bool
  when OPERATORS.GTE
       * Comprovar/castejar que els dos tipus siguin iguals, i que siguin
       * o bé integrals (char castejat a int o int o bool cast a int)
       * o bé reals (double). Es casteja de menys tamany a mes sempre, mai al reves
  
       * Retorna tipus bool
  when OPERATORS.EQ
       * Comprovar/castejar que els dos tipus siguin iguals, i que siguin
       * o bé integrals (char castejat a int o int o bool cast a int)
       * o bé reals (double). Es casteja de menys tamany a mes sempre, mai al reves
  
       * Retorna tipus bool
  when OPERATORS.NEQ
       * Comprovar/castejar que els dos tipus siguin iguals, i que siguin
       * o bé integrals (char castejat a int o int o bool cast a int)
       * o bé reals (double). Es casteja de menys tamany a mes sempre, mai al reves
  
       * Retorna tipus bool
  when STATEMENTS.IF_THEN
       * Comprovar/castejar que la condicio es un boolea
       * Comprovar recursivament el cos del then
  
       * Retorna void
  when STATEMENTS.IF_THEN_ELSE
       * Comprovar/castejar que la condicio es un boolea
       * Comprovar recursivament el cos del then i del else
  
       * Retorna void
  when STATEMENTS.WHILE
       * Comprovar/castejar que la condicio es un boolea
       * Comprovar recursivament el cos del while
  
       * Retorna void
  when STATEMENTS.FOR
       * Comprovar recursivament la inicialitzacio i el increment, comprovar/castejar que la condicio es un boolea
       * Comprovar recursivament el cos del for
  
       * Retorna void
  when STATEMENTS.RETURN # Com collons sabré el tipus de la funció? :S (l'hauré de passar com a paràmetre d'aquesta...)
       * Comprovar/castejar que retorna el mateix tipus que el de la funció en la que estem
       * Si la funció en la que estem retorna void sa danar al tanto
  
       * Retorna void
  when STATEMENTS.CIN
       * Comprovar que tots els fills son ids
       * retorna bool
  when STATEMENTS.COUT
       * Comprovar/castejar que tots els fills siguin strings o endl, que es convertira a "\n" (string)
       * Retorna void
   */

  /*
   */
};

this.checkVariables = function(ast) {
  var argAst, argId, argListAst, argType, blockInstructionsAst, definedVariables, definedVariablesAux, functionAst, functionId, j, k, len, len1, ref, ref1, returnType;
  assert(ast.getType() === NODES.BLOCK_FUNCTIONS);
  definedVariables = {};
  ref = ast.getChildren();
  for (j = 0, len = ref.length; j < len; j++) {
    functionAst = ref[j];
    assert(functionAst.getType() === TYPES.FUNCTION);
    returnType = functionAst.getChild(0);
    functionId = functionAst.getChild(1).getChild(0);
    if (definedVariables[functionId] != null) {
      throw Error.FUNCTION_REDEFINITION.complete('name', functionId);
    }
    definedVariables[functionId] = TYPES.FUNCTION;
    functions[functionId] = {
      returnType: returnType,
      argTypes: []
    };
    argListAst = functionAst.getChild(2);
    assert(argListAst.getType() === NODES.ARG_LIST);
    definedVariablesAux = copy(definedVariables);
    ref1 = argListAst.getChildren();
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      argAst = ref1[k];
      assert(argAst.getType() === NODES.ARG);
      argId = argAst.getChild(1).getChild(0);
      argType = argAst.getChild(0);
      if (argType === TYPES.VOID) {
        throw Error.VOID_FUNCTION_ARGUMENT.complete('function', functionId, 'argument', argId);
      }
      functions[functionId].argTypes.push(argType);
      if (definedVariablesAux[argId] != null) {
        throw Error.VARIABLE_REDEFINITION.complete('name', argId);
      }
      definedVariablesAux[argId] = argType;
    }
    blockInstructionsAst = functionAst.getChild(3);
    assert(blockInstructionsAst.getType() === NODES.BLOCK_INSTRUCTIONS);
    checkAndPreprocess(blockInstructionsAst, definedVariablesAux, functionId);
  }
  return ast;
};


},{"../error":2,"../parser/ast":4,"assert":10}],9:[function(require,module,exports){

},{}],10:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":15}],11:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],12:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":13}],13:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],14:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],15:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":14,"_process":13,"inherits":11}]},{},[1]);