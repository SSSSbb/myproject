package com.icodeview.rock.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.icodeview.rock.admin.dto.RbacPartsDto;
import com.icodeview.rock.admin.dto.RbacProfileDto;
import com.icodeview.rock.admin.pojo.RbacParts;
import com.icodeview.rock.admin.vo.RbacPartsVo;
import com.icodeview.rock.admin.vo.RbacProfileVo;
import com.icodeview.rock.vo.PageResult;

public interface RbacPartsService  extends IService<RbacParts> {
    PageResult<RbacPartsVo> getIndex(Integer id, String name, String sup, String man, Integer belongto, Long pageNum, Long pageSize);
    void createParts(RbacPartsDto partsDto);
    void deleteParts(Integer id);
    void PartsDipose(Integer id);
    void PartsUse(Integer id);

    void updateParts(RbacPartsDto partsDto);
}
