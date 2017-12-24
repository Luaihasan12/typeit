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

test('Pauses typing correctly.', () => {

  document.body.innerHTML =
    `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt('#element');

  instance.instances.forEach((instance) => {
    expect(instance.queue).toHaveLength(23);
  });

});
