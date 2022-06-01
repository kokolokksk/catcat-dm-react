import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useDisclosure } from "@chakra-ui/react"
import React from "react"
const MenuItem = (prop:any | undefined) =>{
    return (
        <>
        <div className="menu-item-container" onClick={prop.click}>
              <div className="menu-item-icon">
              {prop.menu.svg}
              </div>
              <span>{prop.menu.name}</span>  
        </div>
        </>
    )}
export default MenuItem