package com.icodeview.rock.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.icodeview.rock.admin.dto.RbacPartsProfileDto;
import com.icodeview.rock.admin.dto.RbacProfileDto;
import com.icodeview.rock.admin.pojo.RbacPartsProfile;
import com.icodeview.rock.admin.vo.RbacProfileVo;
import com.icodeview.rock.admin.vo.partsProfileVo;
import com.icodeview.rock.vo.PageResult;

public interface RbacPartsProfileService extends IService<RbacPartsProfile> {
    PageResult<partsProfileVo> getIndex(Integer id, Integer partsid,String name, String status, Integer which, String maintaintype, Integer belongto, Long pageNum, Long pageSize);
    void createPartsProfile(RbacPartsProfileDto partsProfileDto);
    void deletePartsProfile(Integer id);
    void updatePartsProfile(RbacPartsProfileDto partsProfileDto);

}
