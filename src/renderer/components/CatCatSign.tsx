/* eslint-disable jsx-a11y/label-has-associated-control */
import '../styles/catcat.css';

const CatCatSign = (prop: any | undefined) => {
  const data = {
    ...prop,
  };
  let color = {
    color: '#efefef',
  };
  // eslint-disable-next-line react/destructuring-assignment
  if (prop.color) {
    // eslint-disable-next-line react/destructuring-assignment
    color = prop.color;
  }
  const { theme } = data;
  return (
    <div id="of" style={color}>
      <label
        style={theme === 'light' ? { color: '#52734D' } : { color: '#735A4D' }}
      >
        C
      </label>
      <label
        style={theme === 'light' ? { color: '#91C788' } : { color: '#C7A788' }}
      >
        a
      </label>
      <label
        style={theme === 'light' ? { color: '#DDFFBC' } : { color: '#FFBA71' }}
      >
        t
      </label>
      <label
        style={theme === 'light' ? { color: '#DDFFBC' } : { color: '#FEC18F' }}
      >
        C
      </label>
      <label
        style={theme === 'light' ? { color: '#91C788' } : { color: '#E0C397' }}
      >
        a
      </label>
      <label
        style={theme === 'light' ? { color: '#52734D' } : { color: '#BD967F' }}
      >
        t
      </label>
    </div>
  );
};
export default CatCatSign;
