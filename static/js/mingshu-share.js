export default {
	data() {
		return {
			adviceContent: '2026年贵人运强,但忌过度依赖。\n正财可期,务实积累。事业易获提携。注意脾胃保养。感情宜主动把握靠谱缘分。',
			annualTags: '跨界拓展、注意财务、人际主升',
			qrCodeUrl: '' // 二维码链接
		}
	},
	onLoad(options) {
		// 设置导航栏样式
		uni.setNavigationBarTitle({
			title: ''
		})
		
		// 生成二维码
		this.$nextTick(() => {
			this.generateQRCode()
		})
	},
	methods: {
		handleBack() {
			uni.navigateBack()
		},
		handleSaveToAlbum() {
			// #ifdef H5
			// H5 版本：使用 html2canvas 截图
			this.saveToAlbumH5()
			// #endif
			
			// #ifndef H5
			// 非 H5 版本：使用 uni.canvasToTempFilePath
			uni.showLoading({
				title: '生成中...'
			})
			
			const query = uni.createSelectorQuery().in(this)
			query.select('#share-content').boundingClientRect((data) => {
				uni.hideLoading()
				uni.showToast({
					title: '保存功能开发中',
					icon: 'none'
				})
			}).exec()
			// #endif
		},
		// H5 版本截图保存
		async saveToAlbumH5() {
			// 检查 html2canvas 是否可用
			if (typeof html2canvas === 'undefined') {
				uni.showToast({
					title: '截图功能暂不可用',
					icon: 'none'
				})
				return
			}
			
			uni.showLoading({
				title: '生成中...'
			})
			
			try {
				// 等待 DOM 渲染完成
				await this.$nextTick()
				
				// 获取背景图和内容元素
				const backgroundImage = document.querySelector('.background-image')
				const contentElement = document.querySelector('#share-content') || 
					document.querySelector('.content-wrapper')
				
				if (!contentElement) {
					throw new Error('未找到要截图的内容元素')
				}
				
				// 获取背景图 URL
				let bgImageUrl = null
				if (backgroundImage) {
					// 尝试多种方式获取图片 URL
					bgImageUrl = backgroundImage.src || 
						backgroundImage.getAttribute('src') || 
						backgroundImage.getAttribute('data-src') ||
						backgroundImage.currentSrc
					
					console.log('原始背景图 URL:', bgImageUrl)
					
					// 如果是相对路径，转换为绝对路径
					if (bgImageUrl) {
						// 处理 uni-app 的路径格式
						if (bgImageUrl.startsWith('/static/')) {
							bgImageUrl = window.location.origin + bgImageUrl
						} else if (!bgImageUrl.startsWith('http') && !bgImageUrl.startsWith('data:') && !bgImageUrl.startsWith('//')) {
							// 相对路径，添加 origin
							if (bgImageUrl.startsWith('/')) {
								bgImageUrl = window.location.origin + bgImageUrl
							} else {
								bgImageUrl = window.location.origin + '/' + bgImageUrl
							}
						}
						
						console.log('处理后的背景图 URL:', bgImageUrl)
					} else {
						console.warn('无法获取背景图 URL')
					}
				} else {
					console.warn('未找到背景图元素')
				}
				
				// 等待所有图片加载完成（包括背景图）
				await this.waitForImages(document.body)
				
				// 获取内容区域的尺寸
				const contentRect = contentElement.getBoundingClientRect()
				const contentWidth = contentElement.scrollWidth || contentRect.width
				const contentHeight = contentElement.scrollHeight || contentRect.height
				
				// 创建临时容器用于截图
				const tempContainer = document.createElement('div')
				tempContainer.style.position = 'absolute'
				tempContainer.style.left = '-9999px'
				tempContainer.style.top = '0'
				tempContainer.style.width = contentWidth + 'px'
				tempContainer.style.height = contentHeight + 'px'
				tempContainer.style.overflow = 'hidden'
				tempContainer.style.backgroundColor = '#8B0000'
				
				// 将背景图作为实际的 img 元素添加（html2canvas 更容易捕获）
				if (bgImageUrl) {
					const bgImg = document.createElement('img')
					bgImg.crossOrigin = 'anonymous'
					bgImg.style.position = 'absolute'
					bgImg.style.top = '0'
					bgImg.style.left = '0'
					bgImg.style.width = '100%'
					bgImg.style.height = '100%'
					bgImg.style.objectFit = 'cover'
					bgImg.style.zIndex = '0'
					bgImg.style.display = 'block'
					
					// 等待背景图加载完成
					await new Promise((resolve) => {
						let resolved = false
						const doResolve = () => {
							if (!resolved) {
								resolved = true
								resolve()
							}
						}
						
						bgImg.onload = () => {
							console.log('背景图加载成功')
							doResolve()
						}
						bgImg.onerror = (e) => {
							console.error('背景图加载失败:', e, bgImageUrl)
							// 即使失败也继续，使用默认背景色
							doResolve()
						}
						
						// 设置 src 触发加载
						bgImg.src = bgImageUrl
						
						// 如果已经加载完成（在设置 src 之后检查）
						setTimeout(() => {
							if (bgImg.complete && !resolved) {
								console.log('背景图已加载完成')
								doResolve()
							}
						}, 100)
						
						// 超时保护
						setTimeout(() => {
							if (!resolved) {
								console.warn('背景图加载超时')
								doResolve()
							}
						}, 3000)
					})
					
					tempContainer.appendChild(bgImg)
				}
				
				// 克隆内容元素（包括所有子元素和样式）
				const contentClone = contentElement.cloneNode(true)
				contentClone.style.position = 'relative'
				contentClone.style.zIndex = '1'
				contentClone.style.width = '100%'
				contentClone.style.height = 'auto'
				contentClone.style.backgroundColor = 'transparent'
				
				// 复制计算后的样式
				const computedStyle = window.getComputedStyle(contentElement)
				contentClone.style.padding = computedStyle.padding
				contentClone.style.margin = computedStyle.margin
				
				tempContainer.appendChild(contentClone)
				
				// 添加到页面（不可见位置）
				document.body.appendChild(tempContainer)
				
				// 等待一下确保渲染完成
				await new Promise(resolve => setTimeout(resolve, 500))
				
				// 再次等待所有图片加载
				await this.waitForImages(tempContainer)
				
				// 使用 html2canvas 截图
				const canvas = await html2canvas(tempContainer, {
					backgroundColor: null, // 不设置背景色，让背景图显示
					scale: 2, // 提高清晰度
					useCORS: true, // 允许跨域图片
					allowTaint: false, // 不允许污染画布
					logging: false, // 关闭日志
					width: tempContainer.offsetWidth,
					height: tempContainer.offsetHeight,
					removeContainer: false // 不自动删除容器
				})
				
				// 清理临时容器
				document.body.removeChild(tempContainer)
				
				// 将 canvas 转换为 blob
				canvas.toBlob((blob) => {
					if (!blob) {
						uni.hideLoading()
						uni.showToast({
							title: '图片生成失败',
							icon: 'none'
						})
						return
					}
					
					// 创建下载链接
					const url = URL.createObjectURL(blob)
					const link = document.createElement('a')
					link.href = url
					link.download = `年度命書_${new Date().getTime()}.png`
					
					// 触发下载
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link)
					
					// 释放 URL 对象
					setTimeout(() => {
						URL.revokeObjectURL(url)
					}, 100)
					
					uni.hideLoading()
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					})
				}, 'image/png', 0.95) // 高质量 PNG
				
			} catch (error) {
				console.error('截图失败:', error)
				uni.hideLoading()
				uni.showToast({
					title: '保存失败，请重试',
					icon: 'none'
				})
			}
		},
		// 等待元素内的图片加载完成
		waitForImages(element) {
			return new Promise((resolve) => {
				const images = element.querySelectorAll('img')
				if (images.length === 0) {
					resolve()
					return
				}
				
				let loadedCount = 0
				const totalCount = images.length
				
				const checkComplete = () => {
					loadedCount++
					if (loadedCount >= totalCount) {
						// 额外等待一小段时间确保渲染完成
						setTimeout(resolve, 100)
					}
				}
				
				images.forEach((img) => {
					if (img.complete) {
						checkComplete()
					} else {
						img.onload = checkComplete
						img.onerror = checkComplete // 即使加载失败也继续
					}
				})
				
				// 设置超时，避免无限等待
				setTimeout(resolve, 3000)
			})
		},
		// 加载图片
		loadImage(url) {
			return new Promise((resolve, reject) => {
				const img = new Image()
				img.crossOrigin = 'anonymous' // 允许跨域
				img.onload = () => {
					resolve(img)
				}
				img.onerror = () => {
					// 即使加载失败也继续，使用默认背景色
					console.warn('背景图加载失败:', url)
					resolve(null)
				}
				img.src = url
			})
		},
		generateQRCode() {
			// 生成二维码
			// 这里需要使用二维码生成库，如 uQRCode
			// 示例代码，需要根据实际使用的库进行调整
			try {
				// 假设使用 uQRCode
				// const uQRCode = require('@/uni_modules/Sansnn-uQRCode/js_sdk/uqrcode/uqrcode.js')
				// uQRCode.make({
				// 	canvasId: 'qrcode',
				// 	componentInstance: this,
				// 	text: this.qrCodeUrl || 'https://example.com',
				// 	size: 200,
				// 	success: (res) => {
				// 		console.log('二维码生成成功', res)
				// 	}
				// })
				
				// 临时方案：显示占位
				console.log('二维码生成功能需要配置')
			} catch (e) {
				console.error('二维码生成失败', e)
			}
		}
	}
}

