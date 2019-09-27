import React from 'react';

const FormField = ({formData,id,change}) => {
// This func to show the error message on the theme
    const showError = () => {
        let errorMessage = <div className="error_label">
            {
                formData.validation && !formData.valid ? 
                    formData.validationMessage
                :null
            }
        </div>
        return errorMessage
    }


// Here we can generate the input element 
    const renderTemplate = () => {
        let formTempalate=null;

        switch(formData.element){
            case('input'):
            formTempalate =(
                <div>
                    {formData.showlabel ? 
                    <div className="label_inputs">
                        {formData.config.label}
                    </div>
                    :null
                    }

                   <input {...formData.config}
                   value= {formData.value}
                   onChange={(event) => change({event,id})}
                 />
                 {showError()}
                </div>
                
            ) 
            break;
            case('select') :
            formTempalate =(
                <div>
                    {formData.showlabel ? 
                    <div className="label_inputs">
                        {formData.config.label}
                    </div>
                    :null
                    }

                   <select
                   value= {formData.value}
                   onChange={(event) => change({event,id})}
                 >
                    <option value="">select One</option>
                        {
                            formData.config.options.map((item)=>(
                                <option key={item.key} value={item.key}>
                                    {item.value}
                                </option>
                            ))
                        }
                   
                 </select>
                 {showError()}
                </div>
            )
            break;
            default:
                formTempalate = null;

        }
        return formTempalate;

    }

    return (
        <div>
            {renderTemplate()}
        </div>
    );
};

export default FormField;