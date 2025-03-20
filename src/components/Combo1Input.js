import React from "react";
import { 
    CCard, 
    CCardBody, 
    CCardHeader,
    CCol,
    CFormInput,
  } from "@coreui/react";

const Combo1Input = ({
    header_2 = "",
    holder= 'Nhập',
    ...props
}) => {
    return (
        <CCard>
            <CCardHeader><strong>{header_2}</strong></CCardHeader>
            <CCardBody>
                    <CCol xs="auto">
                        <CFormInput type="text" placeholder={holder} />
                    </CCol>
            </CCardBody>
        </CCard>
    );
};

export default Combo1Input;
