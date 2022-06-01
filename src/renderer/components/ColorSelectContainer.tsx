import { Button, ButtonGroup } from '@chakra-ui/react'
import ColorSelectItem from './ColorSelectItem'

const ColorSelectContainer = (prop: any | undefined) =>{

return (
    <>
        <div id="color-container" className="display:flex">
        <ColorSelectItem colorItemContainerId = {'color-container'} label={'背景颜色'} colorItemPreviwerId = {'color-back'} c = {prop.c} />
        <div id="color-preview" className="padding-left:2vw;padding-right:2vw">
            <p/>
            预览:
            <div id="pc3"  className="backColorPreview" >
                <p  id="pc4" className="{color:danmuColorPreview.color,textShadow:dmTs}">文字</p>
            </div>
            <div id="pc444" className="borderAreaTopColor">
            </div>
            <div id="pc555" className="borderAreaBotColor">
            </div>
        </div>
        </div>
    </>
    
)
}

export default ColorSelectContainer