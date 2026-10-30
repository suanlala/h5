export default {
	data() {
		return {
			formData: {
				name: '',
				phone: '',
				region: '',
				detail: ''
			}
		}
	},
	onLoad(options) {
		// 如果有传入地址ID，可以加载对应的地址信息（编辑模式）
		if (options.id) {
			this.loadAddressData(options.id)
		}
	},
	methods: {
		// 加载地址数据（编辑模式）
		loadAddressData(id) {
			// 这里可以从服务器加载数据
			// 暂时使用模拟数据
		},
		// 初始化地址选择器（已由 AddressPicker 组件处理，保留此方法以防其他地方调用）
		initRegionPicker() {
			// 地址选择器已由 AddressPicker 组件处理，此方法保留为空
		},
		// 地址选择器变化
		handleRegionChange(e) {
			// e 是 AddressPicker 组件返回的对象，包含 address, indices, province, city, area 等
			if (e && e.address) {
				this.formData.region = e.address
			}
		},
		// 返回
		handleBack() {
			uni.navigateBack()
		},
		// 确定
		handleConfirm() {
			// 验证表单
			if (!this.formData.name || !this.formData.name.trim()) {
				uni.showToast({
					title: '請輸入收件人姓名',
					icon: 'none'
				})
				return
			}
			
			if (!this.formData.phone || !this.formData.phone.trim()) {
				uni.showToast({
					title: '請輸入收件人電話號碼',
					icon: 'none'
				})
				return
			}
			
			if (!this.formData.region || !this.formData.region.trim()) {
				uni.showToast({
					title: '請選擇所在區域',
					icon: 'none'
				})
				return
			}
			
			if (!this.formData.detail || !this.formData.detail.trim()) {
				uni.showToast({
					title: '請輸入詳細地址',
					icon: 'none'
				})
				return
			}
			
			// 保存地址数据
			// 这里应该调用API保存到服务器
			console.log('保存地址:', this.formData)
			
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
			
			// 延迟返回上一页
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		}
	}
}

