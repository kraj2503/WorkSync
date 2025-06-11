

export default async function User({params}) {
    
    const userId = await params.userId;
    
    console.log(userId)
    return <>
        {userId}
    
    </>
}