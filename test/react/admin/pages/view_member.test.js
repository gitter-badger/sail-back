'use strict'

var test = require('tape')
var React = require('react/addons')
var Component = require('../../../../src/admin/pages/view_member.js')
var arrayify = require('../../../../src/utils/arrayify.js')
var change = React.addons.TestUtils.Simulate.change
var click = React.addons.TestUtils.Simulate.click

var member = require('../../../../src/mock_member.js')
var events = require('../../../../src/mock_events.js')

Component.__set__('request', function (opts, cb) {
  opts.uri.match(/\/events/) ?
      cb(null, {body: JSON.stringify(events)}) :
      cb(null, {body: JSON.stringify(member)})})

test('should load admin view member page', function (t) {

  var node = document.body
  React.render(React.createElement(Component, {
    member: member,
    params: {
      id: 1234
    }
  }), node, function () {
    t.ok(node.innerHTML.indexOf('Member info') > -1)
    t.ok(node.innerHTML.indexOf('1234') > -1)
    t.ok(node.innerHTML.indexOf('member-component') > -1)
    t.end()})})

test('should render member details', function (t) {

  var node = document.body
  React.render((
    React.createElement(Component, {
      member: member,
      params: {
        id: 1234
      }
    })
  ), node, function () {

    t.ok(node.innerHTML.indexOf('edit-member-mode') > -1)
    t.ok(node.innerHTML.indexOf('member-info-content') > -1)
    t.ok(node.innerHTML.indexOf('Personal info') > -1)
    t.ok(node.innerHTML.indexOf('Address info') > -1)
    t.ok(node.innerHTML.indexOf('Membership info') > -1)
    t.end()
  })
})

test('should render payments section', function (t) {

  var node = document.body
  React.render((
    React.createElement(Component, {
      member: member,
      params: {
        id: 1234
      }
    })
  ), node, function () {

    t.ok(node.innerHTML.indexOf('Payment info') > -1)
    t.ok(node.innerHTML.indexOf('subscription_btn') > -1)
    t.end()
  })
})

test('should render events section', function (t) {

  var node = document.body
  React.render((
    React.createElement(Component, {
      member: member,
      params: {
        id: 1234
      }
    })
  ), node, function () {

    t.ok(node.innerHTML.indexOf('events-section') > -1)
    t.ok(node.innerHTML.indexOf('Events') > -1)
    t.end()
  })
})

test('should toggle between edit and view mode', function (t) {

  var node = document.body
  function get_data_nodes () {
    return arrayify(node.querySelectorAll('.member-info-content .info')).map(function (node) {
      return node.nextSibling })}

  function check_nodes_tag (tag, nodes) {
    return nodes.every(function (node){
      return node.tagName.toLowerCase() === tag })}

  function assert_all_nodes_of_tag (tag, nodes) {
    t.ok(check_nodes_tag(tag, nodes)) }

  assert_all_nodes_of_tag('span', get_data_nodes())
  node.querySelector('#edit-member-mode').click()
  process.nextTick(function () {

    assert_all_nodes_of_tag('input', get_data_nodes())
    t.end()
  })
})

test('should be able to add charges', function (t) {


  var node = document.body
  
  React.render(React.createElement(Component, {
    member: member,
    params: {
      id: 1234
    }
  }), node, function () {
 
    var fields =['event', 'subscription', 'donation', 'payment']
    
    t.ok(fields.every(function(field){ 
      return !!document.querySelector('#'+field+'_btn')
    }), 'all field buttons present')
    fields.forEach(function (field, i) {
      
      t.test('checking rendering of ' + field, function (st) {
      
        var button = document.querySelector('#'+field+'_btn')
        click(button)
        process.nextTick(function () {
          
          st.ok(document.querySelector('.' + field), field + ' displaying')
          st.end()
        })
      })
    })
    
    
   /* 
    t.test(function (st) {
    
      var button = document.querySelector('#event_btn')
      click(button)
      process.nextTick(function () {
         
        st.ok(document.querySelector('.event'), 'event displaying')
        st.end()
      })
    })
  
 */
    /*
    click(document.querySelector('#event_btn'))
    process.nextTick(function () {
       
      var check = document.querySelector('.event')
      t.ok(check, 'ok@')
      t.end()
    })
    */
/*
    fields.forEach(function (field) {
    
      click(document.querySelector('#'+field+'_btn'))
      var check = document.querySelector('#hohoho')
      t.notOk(check, 'not ok@')
      var btn = document.querySelector('#'+field+'_btn')
      t.ok(!!btn, 'btn olk')
      process.nextTick(function () {
        var check = document.querySelector('#hohoho')
        t.ok(check, 'ok@')
        //t.equals(document.querySelector('#hohoho').innerHTML, 'aoeu')
        // t.ok(document.querySelector('h2.'+field), field +' header exists')
      })
    })
  */  
    /* TODO: test clicks on buttons  */
    /* TODO: test input of fields  */
    /* TODO: test save on fields  */
   // node.querySelector('h1')  
   // t.end()
  })
})
