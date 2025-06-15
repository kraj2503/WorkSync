

export default async function User({params}:{params:r}) {
    
    const userId = await params.userId;
    
    console.log(userId)
    return <>
        {userId}
    
    </>
}