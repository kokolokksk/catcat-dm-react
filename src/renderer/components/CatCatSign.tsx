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
        style={theme === 'dark' ? { color: '#735A4D' } : { color: '#52734D' }}
      >
        C
      </label>
      <label
        style={theme === 'dark' ? { color: '#C7A788' } : { color: '#91C788' }}
      >
        a
      </label>
      <label
        style={theme === 'dark' ? { color: '#FFBA71' } : { color: '#DDFFBC' }}
      >
        t
      </label>
      <label
        style={theme === 'dark' ? { color: '#FEC18F' } : { color: '#DDFFBC' }}
      >
        C
      </label>
      <label
        style={theme === 'dark' ? { color: '#E0C397' } : { color: '#91C788' }}
      >
        a
      </label>
      <label
        style={theme === 'dark' ? { color: '#BD967F' } : { color: '#52734D' }}
      >
        t
      </label>
    </div>
  );
};
export default CatCatSign;
