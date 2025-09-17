export class AuthService{
    async logout()
    {
        localStorage.removeItem("token")
        localStorage.removeItem("image")
    }
}
const authService=new AuthService()
export default authService