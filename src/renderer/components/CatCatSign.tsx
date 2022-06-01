/* eslint-disable jsx-a11y/label-has-associated-control */
import '../styles/catcat.css';

const CatCatSign = (prop: any | undefined) => {
  let color = {
    color: '#efefef',
  };
  // eslint-disable-next-line react/destructuring-assignment
  if (prop.color) {
    // eslint-disable-next-line react/destructuring-assignment
    color = prop.color;
  }

  return (
    <div id="of" style={color}>
      <label style={{ color: '#52734D' }}>C</label>
      <label style={{ color: '#91C788' }}>a</label>
      <label style={{ color: '#DDFFBC' }}>t</label>
      <label style={{ color: '#DDFFBC' }}>C</label>
      <label style={{ color: '#91C788' }}>a</label>
      <label style={{ color: '#52734D' }}>t</label>
    </div>
  );
};
export default CatCatSign;
