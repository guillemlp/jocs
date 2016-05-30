assert = require 'assert'

Stack   = require './stack'
Ast     = require '../parser/ast'
Eval    = require './expression'
{ NODES, STATEMENTS } = Ast

module.exports = @

funcName2Tree = null

outputString = [""]

@executeListInstructions = (T) ->
    assert T?
    for child in T.getChildren()
        result = executeInstruction child
        result.output = outputString if not result?.output?
        outputString = [""]
        return result if result
    null

executeInstruction = (T) ->
    assert T?
    switch T.getType()
        when NODES.TYPE_DECL
            type = T.getChild 0
            decl = T.getChild 1
            for atom in decl
                varName = atom.getChild 0
                if atom.getType() is NODES.ASSIGN
                    value = Eval.evaluateExpression atom.getChild, 1
                    # TODO: Data?
                    value = new Data type value
                    stack.defineVariable varName, value
                else if atom.getType is NODES.ID
                    stack.defineVariable(varName, new Data type)
        when NODES.BLOCK_ASSIGN
            executeListInstructions T
        when NODES.ASSIGN
            id    = T.getChild 0
            value = Eval.evaluateExpression T.getChild 1
            data.setValue value
        when STATEMENTS.COUT
            for outputItem in T.getChildren()
                # TODO: extract constant
                if outputItem.getType() is NODES.ENDL 
                    outputString.push("")
                else 
                    outputString[outputString.length - 1] += (Eval.evaluateExpression outputItem)
        when STATEMENTS.RETURN
            value: Eval.evaluateExpression(T.getChild 0)
            output: outputString
        else throw 'Instruction ' + T.getType() + ' not implemented yet.'
            

@executeFunction = (funcName, args = null) ->
    assert funcName2Tree.main?
    func = funcName2Tree[funcName]
    assert func?, 'Function ' + funcName + ' not declared'
    arg_values = listArguments(func.getChild(2), args)
    Stack.pushActivationRecord()

    for { id, value } in arg_values
        Stack.defineVariable id, value

    result = instruction.executeListInstructions func.getChild(3)
    Stack.popActivationRecord()
    # If main function is executed and no result is returned, value 0 is returned
    if funcName is 'main' and not result
        result.value = 0
    result

listArguments = (argListAst, args) ->
    for argAst, i in args.getChildren()
        id : argAst.getChild(0)
        value: Eval.evaluateExpression(args.getChild(0))
