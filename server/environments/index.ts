export const apiAddr = () => {
    return `${environment.apiUrl}:${environment.port}`; 
}

export const environment = {
    apiUrl:  'http://192.168.1.70',
    port: '3333'    
};