package com.icodeview.rock.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.icodeview.rock.admin.dto.RbacBasicInfoDto;
import com.icodeview.rock.admin.pojo.RbacBasicInfo;
import com.icodeview.rock.admin.vo.RbacBasicInfoVo;
import com.icodeview.rock.vo.PageResult;

public interface RbacBasicInfoService extends IService<RbacBasicInfo> {
    PageResult<RbacBasicInfoVo> getIndex(Integer id,Integer profileid,String name,Integer belongto,Long pageNum, Long pageSize);
    void createBasicInfo(RbacBasicInfoDto basicInfoDto);
    void deleteBasicInfo(Integer id);
    void updateBasicInfo(RbacBasicInfoDto basicInfoDto);
}
