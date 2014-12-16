chai      = require('chai')
expect    = chai.expect
should    = chai.should()
sinon     = require('sinon')
sinonChai = require('sinon-chai')
_         = require("underscore")

chai.use(sinonChai)

Connector = require "../bower_components/connector/lib/test-connector/test-connector.coffee"
Yatta = require "../lib/Yatta.coffee"

Test = require "./TestSuite"

class JsonTest extends Test
  makeNewUser: (userId)->
    conn = new Connector userId
    super new Yatta conn

  type: "JsonTest"

  getRandomRoot: (user_num, root)->
    root ?= @users[user_num].getSharedObject()
    types = @users[user_num].types
    if _.random(0,1) is 1 # take root
      root
    else # take child
      properties =
        for oname,val of root.val()
          oname
      properties.filter (oname)->
        root[oname] instanceof types.Operation
      if properties.length is 0
        root
      else
        p = root[properties[_.random(0, properties.length-1)]]
        @getRandomRoot user_num, p

  getContent: (user_num)->
    @users[user_num].toJson()

  getGeneratingFunctions: (user_num)->
    types = @users[user_num].types
    super(user_num).concat [
        f : (y)=> # SET PROPERTY
          y.val(@getRandomKey(), @getRandomText(), 'immutable')
          null
        types : [types.JsonType]
      ,
        f : (y)=> # SET Object Property 1)
          y.val(@getRandomObject())
        types: [types.JsonType]
      ,
        f : (y)=> # SET Object Property 2)
          y.val(@getRandomKey(), @getRandomObject())
        types: [types.JsonType]
      ,
        f : (y)=> # SET PROPERTY TEXT
          y.val(@getRandomKey(), @getRandomText(), 'mutable')
        types: [types.JsonType]
    ]

describe "JsonFramework", ->
  beforeEach (done)->
    @timeout 50000
    @yTest = new JsonTest()
    @users = @yTest.users

    @test_user = @yTest.makeNewUser "test_user"
    done()

  it "can handle many engines, many operations, concurrently (random)", ->
    console.log "" # TODO
    @yTest.run()

  it "has a change listener", ()->
    addName = false
    change = false
    change2 = 0
    @test_user.on 'addProperty', (eventname, property_name)->
      if property_name is 'x'
        addName = true
    @test_user.val('x',5)
    @test_user.on 'change', (eventname, property_name)->
      if property_name is 'x'
        change = true
    @test_user.val('x', 6)
    @test_user.val('ins', "text", 'mutable')
    @test_user.on 'change', (eventname, property_name)->
      if property_name is 'ins'
        change2++
    @test_user.val('ins').insertText 4, " yay"
    @test_user.val('ins').deleteText 0, 4
    expect(addName).to.be.ok
    expect(change).to.be.ok
    expect(change2).to.equal 8

  it "has a JsonTypeWrapper", ->
    y = this.yTest.getSomeUser().getSharedObject()
    y.val('x',"dtrn", 'immutable')
    y.val('set',{x:"x"}, 'immutable')
    w = y.value
    w.x
    w.set = {y:""}
    w.x
    w.set
    w.set.x
    expect(w.x).to.equal("dtrn")
    expect(w.set.x).to.equal("x")
    y.value.x = {q:4}
    expect(y.value.x.q).to.equal(4)


  it "has a working test suite", ->
    @yTest.compareAll()

  it "handles double-late-join", ->
    test = new JsonTest("double")
    test.run()
    @yTest.run()
    u1 = test.users[0]
    u2 = @yTest.users[1]
    ops1 = u1.HB._encode()
    ops2 = u2.HB._encode()
    u1.engine.applyOps ops2
    u2.engine.applyOps ops1
    expect(test.getContent(0)).to.equal(@yTest.getContent(1))
    
  it "can handle creaton of complex json (1)", ->
    @yTest.users[0].val('a', 'q')
    @yTest.users[2].val('a', 't')
    @yTest.compareAll()
    q = @yTest.users[1].val('a') 
    q.insertText(0,'A')
    @yTest.compareAll()
    expect(@yTest.getSomeUser().value.a.val()).to.equal("At")

  it "can handle creaton of complex json (2)", ->
    @yTest.getSomeUser().val('x', {'a':'b'})
    @yTest.getSomeUser().val('a', {'a':{q:"dtrndtrtdrntdrnrtdnrtdnrtdnrtdnrdnrdt"}})
    @yTest.getSomeUser().val('b', {'a':{}})
    @yTest.getSomeUser().val('c', {'a':'c'})
    @yTest.getSomeUser().val('c', {'a':'b'})
    @yTest.compareAll()
    q = @yTest.getSomeUser().value.a.a.q
    q.insertText(0,'A')
    @yTest.compareAll()
    expect(@yTest.getSomeUser().value.a.a.q.val()).to.equal("Adtrndtrtdrntdrnrtdnrtdnrtdnrtdnrdnrdt")

  it "handles immutables and primitive data types", ->
    @yTest.getSomeUser().val('string', "text", "immutable")
    @yTest.getSomeUser().val('number', 4, "immutable")
    @yTest.getSomeUser().val('object', {q:"rr"}, "immutable")
    @yTest.getSomeUser().val('null', null)
    @yTest.compareAll()
    expect(@yTest.getSomeUser().val('string')).to.equal "text"
    expect(@yTest.getSomeUser().val('number')).to.equal 4
    expect(@yTest.getSomeUser().val('object').val('q')).to.equal "rr"
    expect(@yTest.getSomeUser().val('null') is null).to.be.ok


