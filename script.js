$(document).ready(function() {
    const flipUnits = {
        'hours-tens': { current: '0', previous: '0' },
        'hours-ones': { current: '0', previous: '0' },
        'minutes-tens': { current: '0', previous: '0' },
        'minutes-ones': { current: '0', previous: '0' },
        'seconds-tens': { current: '0', previous: '0' },
        'seconds-ones': { current: '0', previous: '0' }
    };

    let config = {
        timeSource: 'system',
        customTime: '',
        apiType: 'sc',
        refreshFrequency: 720 // 12小时（分钟）
    };

    let customTimeBase = null;
    let customTimeOffset = 0;
    let fetchPoemInterval = null;

    function updateFlipUnit(unitId, newValue) {
        const unit = flipUnits[unitId];
        if (unit.current === newValue) return;

        unit.previous = unit.current;
        unit.current = newValue;

        const $flipUnit = $('#' + unitId);
        const $number = $flipUnit.find('.number');
        $number.text(newValue);
    }

    function updateClock() {
        let now;
        
        switch (config.timeSource) {
            case 'custom':
                if (config.customTime) {
                    // 初始化自定义时间基准
                    if (!customTimeBase) {
                        const baseDate = new Date();
                        const [hours, minutes, seconds] = config.customTime.split(':').map(Number);
                        customTimeBase = baseDate.getTime();
                        customTimeOffset = (hours * 3600 + minutes * 60 + (seconds || 0)) * 1000 - (baseDate.getHours() * 3600 + baseDate.getMinutes() * 60 + baseDate.getSeconds()) * 1000;
                    }
                    
                    // 基于基准时间和偏移量计算当前自定义时间
                    const currentTime = new Date().getTime();
                    const elapsed = currentTime - customTimeBase;
                    now = new Date(currentTime + customTimeOffset);
                } else {
                    now = new Date();
                }
                break;
            case 'ntp':
                // 这里简化处理，实际应该使用 NTP 服务器同步
                now = new Date();
                break;
            case 'system':
            default:
                // 重置自定义时间基准
                customTimeBase = null;
                now = new Date();
                break;
        }

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        updateFlipUnit('hours-tens', hours[0]);
        updateFlipUnit('hours-ones', hours[1]);
        updateFlipUnit('minutes-tens', minutes[0]);
        updateFlipUnit('minutes-ones', minutes[1]);
        updateFlipUnit('seconds-tens', seconds[0]);
        updateFlipUnit('seconds-ones', seconds[1]);
    }

    function initClock() {
        let now;
        
        switch (config.timeSource) {
            case 'custom':
                if (config.customTime) {
                    const customDate = new Date();
                    const [hours, minutes, seconds] = config.customTime.split(':').map(Number);
                    customDate.setHours(hours, minutes, seconds || 0, 0);
                    now = customDate;
                } else {
                    now = new Date();
                }
                break;
            case 'ntp':
            case 'system':
            default:
                now = new Date();
                break;
        }

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const timeValues = {
            'hours-tens': hours[0],
            'hours-ones': hours[1],
            'minutes-tens': minutes[0],
            'minutes-ones': minutes[1],
            'seconds-tens': seconds[0],
            'seconds-ones': seconds[1]
        };

        Object.keys(timeValues).forEach(unitId => {
            const value = timeValues[unitId];
            flipUnits[unitId].current = value;
            flipUnits[unitId].previous = value;

            const $flipUnit = $('#' + unitId);
            $flipUnit.find('.number').text(value);
        });
    }

    function fetchPoem() {
        console.log('开始获取内容，API URL:', `https://api.p6oy.top/api/yy?type=${config.apiType}`);
        $.ajax({
            url: `https://api.p6oy.top/api/yy?type=${config.apiType}`,
            type: 'get',
            success: function(data) {
                console.log('获取内容成功:', data);
                if (data && data.hitokoto) {
                    console.log('更新内容:', data.hitokoto);
                    $('#hitokoto').html(data.hitokoto);
                    $('#hitokoto_from').html(data.hitokoto_from || '');
                } else {
                    console.log('获取内容失败：数据格式不正确');
                    $('#hitokoto').html('获取内容失败');
                }
            },
            error: function(xhr, status, error) {
                console.error('获取内容失败:', error);
                $('#hitokoto').html('获取内容失败，请检查网络连接');
                $('#hitokoto_from').html('');
            }
        });
    }

    // 加载配置
    function loadConfig() {
        if (window.electronAPI) {
            try {
                window.electronAPI.getCurrentConfig().then((newConfig) => {
                    config = { ...config, ...newConfig };
                    console.log('配置加载成功:', config);
                    updateFetchPoemInterval();
                    // 加载配置后立即获取与配置匹配的内容
                    console.log('加载配置后获取内容，API类型:', config.apiType);
                    fetchPoem();
                });
            } catch (error) {
                console.error('加载配置失败:', error);
            }
        }
    }

    // 更新诗句刷新间隔
    function updateFetchPoemInterval() {
        if (fetchPoemInterval) {
            clearInterval(fetchPoemInterval);
        }
        // 转换为毫秒
        const interval = config.refreshFrequency * 60 * 1000;
        fetchPoemInterval = setInterval(fetchPoem, interval);
        console.log('诗句刷新间隔已更新:', interval / 1000 / 60, '分钟');
    }

    // 初始化
    function init() {
        // 先初始化时钟
        initClock();
        updateClock();
        
        // 加载配置（异步）
        if (window.electronAPI) {
            window.electronAPI.getCurrentConfig().then((newConfig) => {
                config = { ...config, ...newConfig };
                console.log('初始化时加载配置成功:', config);
                updateFetchPoemInterval();
                // 配置加载完成后获取内容
                console.log('初始化时获取内容，API类型:', config.apiType);
                fetchPoem();
            }).catch((error) => {
                console.error('初始化时加载配置失败:', error);
                // 加载失败时使用默认配置获取内容
                console.log('加载配置失败，使用默认配置获取内容');
                fetchPoem();
            });
        } else {
            // 没有electronAPI时使用默认配置
            console.log('没有electronAPI，使用默认配置获取内容');
            fetchPoem();
        }

        setInterval(updateClock, 1000);
        updateFetchPoemInterval();
    }

    // 监听配置更新
    window.addEventListener('config-updated', (event) => {
        const newConfig = event.detail;
        config = { ...config, ...newConfig };
        console.log('配置已更新:', config);
        updateFetchPoemInterval();
        
        // 重置自定义时间基准，以便重新计算
        customTimeBase = null;
        
        // 重新初始化时钟以应用时间设置
        initClock();
        updateClock();
        
        // 立即刷新诗句以应用 API 类型变更
        console.log('正在获取新内容，API类型:', config.apiType);
        fetchPoem();
    });

    // 启动应用
    init();
});
