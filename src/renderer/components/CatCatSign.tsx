
import '../styles/catcat.css'
const CatCatSign = (prop: any | undefined) =>{
    let color = {
        color:'#efefef'
    }
    if (prop.color) {
        color = prop.color
    }
    
    return(
        <div id="of" style={color }>
            <label style={{color:'#52734D'}}>C</label>
            <label style={{color:'#91C788'}}>a</label>
            <label style={{color:'#DDFFBC'}}>t</label>
            <label style={{color:'#DDFFBC'}}>C</label>
            <label style={{color:'#91C788'}}>a</label>
            <label style={{color:'#52734D'}}>t</label> 
        </div>
    )
}
export default CatCatSign