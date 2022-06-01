import styles  from '@/styles/color.module.scss'
import { Button, ButtonGroup } from '@chakra-ui/react'
import Colorful from '@uiw/react-color-colorful'
import { useState } from 'react'

const ColorSelectItem = (prop: any | undefined) => {
    let colorItemContainerId = prop.colorItemContainerId
    const [hex, setHex] = useState("#fff")
    return(
            <>
                <div id={prop.colorItemContainerId} className={styles.colorItemContainer}>
                    <p/>
                    {prop.label}
                    <div id={prop.colorItemPreviwerId} className={styles.colorItemPreviwer} >
                    <div>
                    <Colorful
                      color={hex}
                      onChange={(color) => {
                        setHex(color.hex);
                      }}
                    />
                    </div>
                    </div>
                    <Button className={styles.leftMargin&&styles.colorItemBtn} onClick={prop.c} >设置</Button>
                </div>
                
            </>
        

    )


}


export default ColorSelectItem