import TypeIt from '../src/typeit';

test('Generates a queue correctly.', () => {

  document.body.innerHTML =
    `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt('#element', {
    strings: ["Taxation is...", "theft."]
  });

  instance.instances.forEach((instance) => {
    expect(instance.queue).toHaveLength(23);
  });

});

test('Generates a queue correctly when chaining upon instantiation.', () => {
  document.body.innerHTML =
    `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt('#element', {})
    .type('First string.')
    .delete()
    .type('Second string.');

  console.log(instance.queue);

  instance.instances.forEach((instance) => {
    expect(instance.queue).toHaveLength(23);
  });
});

test('Pauses and resumes typing.', () => {

  jest.useFakeTimers();

  document.body.innerHTML =
    `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt('#element', {
    strings: "Chicken nuggets."
  });

  //-- Pause typing.
  instance.pause();

  instance.instances.forEach((instance) => {
    expect(instance.isPaused).toBe(true);
  });

  //-- Resume typing.
  setTimeout(() => {
    instance.type();
  }, 1000);

  jest.runAllTimers();

  let typedString = document.querySelector('#element .ti-container').innerHTML;

  expect(typedString).toEqual('Chicken nuggets.');

});

test('Instance is marked complete successfully.', () => {

  jest.useFakeTimers();

  document.body.innerHTML =
    `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt('#element', {
    strings: ["Ham over turkey.", "<strong>Obviously.</strong>"]
  });

  jest.runAllTimers();

  let typedString = document.querySelector('#element .ti-container').innerHTML;

  //-- Typing should be complete with the correct string.
  expect(instance.isComplete).toBe(true);
  expect(typedString).toEqual('Ham over turkey.<br><strong>Obviously.</strong>');
});

test('Can type new string after completion.', () => {

  jest.useFakeTimers();

  document.body.innerHTML =
    `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt('#element', {
    strings: "Ham over turkey."
  });

  jest.runAllTimers();

  let typedString = document.querySelector('#element .ti-container').innerHTML;

  expect(typedString).toEqual('Ham over turkey.');

  instance.type(' Obviously.');

  jest.runAllTimers();

  typedString = document.querySelector('#element .ti-container').innerHTML;

  expect(typedString).toEqual('Ham over turkey. Obviously.');
});
