const durationToast = (title,duration)=>{
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}
module.exports={
	durationToast
}